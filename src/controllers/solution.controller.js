const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { exec } = require("child_process");
const Problem = require("../models/Problem.js");
const Student = require("../models/Student.js");
const Solution = require("../models/Solution.js");
const Attempt = require("../models/Attempt.js");

const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, "").trim();

exports.getSolution = async (req, res) => {
  try {
    if (!req.student || !req.student.id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }
    const solutions = await Solution.find({ studentId: req.student.id });
    return res.json({ data: solutions });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const executeCode = async (fileName, command, input, expectedOutput, code) => {
  const filePath = path.join(__dirname, "../tests", fileName);
  fs.writeFileSync(filePath, code, { encoding: "utf8" });
  return new Promise((resolve) => {
    const child = exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      const actualOutput = stripAnsi(stdout);
      const isCorrect = actualOutput.trim() === expectedOutput.trim();
      resolve({
        actualOutput,
        isCorrect,
        error: error ? stripAnsi(stderr) : null,
      });
    });
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
};

const downloadFile = async (url, filepath) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filepath, response.data);
  } catch (error) {
    throw new Error("Invalid URL");
  }
};

exports.checkSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        status: "error",
        message: "Code and language are required",
      });
    }
    if (!req.student || !req.student.id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        status: "error",
        message: "Problem not found",
      });
    }
    if (!problem.testCases || problem.testCases.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Test cases not found for the problem",
      });
    }
    const existingSolution = await Solution.findOne({
      studentId: req.student.id,
      problemId: problem._id,
    });
    const timestamp = Date.now();
    let fileName, command;
    switch (language.toLowerCase()) {
      case "python":
        fileName = `${timestamp}.py`;
        command = `python ${path.join(__dirname, "../tests", fileName)}`;
        break;
      case "java":
        fileName = `Solution.java`;
        const updatedJavaCode = code.replace(
          /public\s+class\s+\w+/g,
          "public class Solution"
        );
        fs.writeFileSync(
          path.join(__dirname, "../tests", fileName),
          updatedJavaCode,
          { encoding: "utf8" }
        );
        command = `javac ${path.join(
          __dirname,
          "../tests",
          fileName
        )} && java -cp ${path.join(__dirname, "../tests")} Solution`;
        break;
      case "javascript":
        fileName = `${timestamp}.js`;
        command = `node ${path.join(__dirname, "../tests", fileName)}`;
        break;
      default:
        return res.status(400).json({
          status: "error",
          message: "Invalid language",
        });
    }
    let allCorrect = true;
    let failedTestCaseIndex = null;
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      const inputFilePath = path.join(
        __dirname,
        "../tests",
        `input_${timestamp}.txt`
      );
      const outputFilePath = path.join(
        __dirname,
        "../tests",
        `output_${timestamp}.txt`
      );
      await downloadFile(testCase.inputFileUrl, inputFilePath);
      await downloadFile(testCase.outputFileUrl, outputFilePath);
      const input = fs.readFileSync(inputFilePath, "utf-8");
      const expectedOutput = fs.readFileSync(outputFilePath, "utf-8");
      const result = await executeCode(
        fileName,
        command,
        input,
        expectedOutput,
        code
      );

      if (!result.isCorrect) {
        allCorrect = false;
        failedTestCaseIndex = i + 1;
        break;
      }
      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(outputFilePath);
    }
    const attempt = new Attempt({
      studentId: req.student.id,
      problemId: problem._id,
      code,
      language,
      isCorrect: allCorrect,
      failedTestCaseIndex,
    });
    await attempt.save();
    if (existingSolution) {
      existingSolution.isCorrect = allCorrect;
      await existingSolution.save();
    } else {
      const solution = new Solution({
        studentId: req.student.id,
        problemId: problem._id,
        code,
        isCorrect: allCorrect,
      });
      await solution.save();
    }
    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }
    if (student.balance === null) {
      student.balance = 0;
    }
    if (allCorrect && (!existingSolution || !existingSolution.isCorrect)) {
      student.balance += problem.point;
    } else {
      console.log("Failed test case index", failedTestCaseIndex);
    }
    student.history.push(problem._id);
    await student.save();
    fs.unlinkSync(path.join(__dirname, "../tests", fileName));
    return res.json({
      data: {
        correct: allCorrect,
        balance: student.balance,
        history: student.history,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.testRunCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({
        status: "error",
        message: "Code and language are required",
      });
    }
    const timestamp = Date.now();
    let fileName, command;
    switch (language.toLowerCase()) {
      case "python":
        fileName = `${timestamp}.py`;
        command = `python ${path.join(__dirname, "../tests", fileName)}`;
        break;
      case "java":
        fileName = `${timestamp}.java`;
        command = `javac ${path.join(
          __dirname,
          "../tests",
          fileName
        )} && java -cp ${path.join(__dirname, "../tests")} ${timestamp}`;
        break;
      case "javascript":
        fileName = `${timestamp}.js`;
        command = `node ${path.join(__dirname, "../tests", fileName)}`;
        break;
      default:
        return res.status(400).json({
          status: "error",
          message: "Invalid language",
        });
    }
    const filePath = path.join(__dirname, "../tests", fileName);
    fs.writeFileSync(filePath, code, { encoding: "utf8" });
    const extractErrorMessage = (errorOutput) => {
      const lines = errorOutput.split("\n");
      const relevantLine = lines.find(
        (line) => line.includes("Error") || line.includes("Exception")
      );
      return relevantLine || "Error in compiler code";
    };
    const result = await new Promise((resolve) => {
      exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error) {
          const errorMessage = extractErrorMessage(stripAnsi(stderr));
          resolve({
            output: errorMessage,
            error: "Execution failed",
          });
        } else {
          resolve({
            output: stripAnsi(stdout),
            error: null,
          });
        }
      });
    });
    fs.unlinkSync(filePath);
    return res.json({ data: result });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};