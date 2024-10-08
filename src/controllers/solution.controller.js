const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const Problem = require("../models/Problem.js");
const Student = require("../models/Student.js");
const Solution = require("../models/Solution.js");

exports.getSolution = async (req, res) => {
  try {
    if (!req.student || !req.student.id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }
    const solutions = await Solution.find({ id: req.student.id });
    return res.json({
      data: solutions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
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
    const testResults = [];
    for (let testCase of problem.testCases) {
      const { input, output: expectedOutput } = testCase;
      const result = await new Promise((resolve) => {
        exec(command, { input }, (error, stdout, stderr) => {
          const actualOutput = stdout.trim();
          const isCorrect = actualOutput === expectedOutput.trim();
          resolve({
            input,
            expected: expectedOutput,
            actual: actualOutput,
            isCorrect,
            error,
          });
        });
      });
      testResults.push(result);
    }
    const allCorrect = testResults.every((result) => result.isCorrect);
    const solution = new Solution({
      studentId: req.student.id,
      problemId: problem._id,
      code,
      isCorrect: allCorrect,
    });
    await solution.save();
    if (!allCorrect) {
      const incorrectTestCase = testResults.find((result) => !result.isCorrect);
      return res.json({
        data: {
          correct: false,
          input: incorrectTestCase.input,
          expected: incorrectTestCase.expected,
          actual: incorrectTestCase.actual,
        },
      });
    }
    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: "Student not found",
      });
    }
    student.balance += problem.point;
    student.history.push(problem._id);
    await student.save();
    return res.json({
      data: {
        correct: true,
        balance: student.balance,
        history: student.history,
      },
    });
  } catch (error) {
    console.error(error);
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
    const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, "");
    const extractErrorMessage = (errorOutput) => {
      const lines = errorOutput.split("\n");
      const relevantLine = lines.find(
        (line) => line.includes("Error") || line.includes("Exception")
      );
      return relevantLine || "Error in compiler code";
    };
    const result = await new Promise((resolve, reject) => {
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
