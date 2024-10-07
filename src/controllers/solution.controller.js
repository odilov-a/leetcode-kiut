const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const Problem = require("../models/Problem.js");
const Student = require("../models/Student.js");
const { getTranslation } = require("../helpers/helper.js");

exports.checkSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        status: "error",
        message: getTranslation("problemNotFound", req.language),
      });
    }
    const timestamp = Date.now();
    let fileName, command;
    switch (language.toLowerCase()) {
      case "python":
        fileName = `${timestamp}.py`;
        command = `python ./src/tests/${fileName}`;
        break;
      case "java":
        fileName = `${timestamp}.java`;
        command = `javac ./src/tests/${fileName} && java -cp ./src/tests ${timestamp}`;
        break;
      case "javascript":
        fileName = `${timestamp}.js`;
        command = `node ./src/tests/${fileName}`;
        break;
      default:
        return res.status(400).json({
          status: "error",
          message: getTranslation("invalidLanguage", req.language),
        });
    }
    const filePath = path.join(__dirname, "../tests", fileName);
    const outputFilePath = path.join(
      __dirname,
      "../tests",
      `${timestamp}_output.txt`
    );
    fs.writeFileSync(filePath, code, { encoding: "utf8" });
    exec(`${command} >> ${outputFilePath}`, async (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          status: "error",
          message: getTranslation("executionError", req.language),
          details: stderr,
        });
      }
      function sanitizeOutput(output) {
        return output.replace(/[\u001b][[0-?9;]*[mG]/g, "").trim();
      }
      const studentOutput = sanitizeOutput(
        fs.readFileSync(outputFilePath, { encoding: "utf8" })
      );
      for (let testCase of problem.testCases) {
        if (studentOutput !== testCase.expectedOutput.trim()) {
          fs.unlinkSync(filePath);
          fs.unlinkSync(outputFilePath);
          return res.json({
            data: {
              correct: false,
              expectedOutput: testCase.expectedOutput,
              studentOutput: studentOutput,
            },
          });
        }
      }
      const student = await Student.findById(req.user.id);
      if (!student) {
        return res.status(404).json({
          status: "error",
          message: getTranslation("studentNotFound", req.language),
        });
      }
      student.balance += problem.point;
      student.history.push(problem._id);
      await student.save();
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputFilePath);
      return res.json({
        data: {
          correct: true,
          balance: student.balance,
          history: student.history,
        },
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: getTranslation(error.message, req.language),
    });
  }
};
