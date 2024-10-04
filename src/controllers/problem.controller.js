const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const Problem = require("../models/Problem.js");
const Student = require("../models/Student.js");
const { getTranslation } = require("../helpers/helper.js");

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate("subject")
      .populate("difficulty");
    return res.json({ data: problems });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id)
      .populate("subject")
      .populate("difficulty");
    if (!problem) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Masala topilmadi",
          ru: "Задача не найдена",
          en: "Problem not found",
        },
      });
    }
    return res.json({ data: problem });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getAllProblemsByDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const problems = await Problem.find({ difficulty })
      .populate("subject")
      .populate("difficulty");
    return res.json({ data: problems });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getAllProblemsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const problems = await Problem.find({ subject })
      .populate("subject")
      .populate("difficulty");
    return res.json({ data: problems });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.searchProblems = async (req, res) => {
  try {
    const { search } = req.query;
    const regex = new RegExp(search, "i");
    const problems = await Problem.find({
      $or: [
        { titleUz: { $regex: regex } },
        { descriptionUz: { $regex: regex } },
        { titleRu: { $regex: regex } },
        { descriptionRu: { $regex: regex } },
        { titleEn: { $regex: regex } },
        { descriptionEn: { $regex: regex } },
      ],
    })
      .populate("subject")
      .populate("difficulty");
    return res.json({ data: problems });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getProblemsBySubjectAndDifficulty = async (req, res) => {
  try {
    const { subject, difficulty } = req.params;
    const problems = await Problem.find({ subject, difficulty })
      .populate("subject")
      .populate("difficulty");
    return res.json({ data: problems });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getAllProblemsByTeacher = async (req, res) => {
  try {
    const { teacher } = req.params;
    const problems = await Problem.find({ teacher })
      .populate("subject")
      .populate("difficulty");
    return res.json({ data: problems });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.checkSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({
        status: "error",
        message: getTranslation("problemNotFound", req.language),
      });
    }

    const timestamp = Date.now();
    let fileName, command;

    // Determine file name and command based on language
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

    // Write the student's code to the file
    fs.writeFileSync(filePath, code, { encoding: "utf8" });

    exec(`${command} >> ${outputFilePath}`, async (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          status: "error",
          message: getTranslation("executionError", req.language),
          details: stderr,
        });
      }

      // Sanitize student output to remove ANSI escape codes
      function sanitizeOutput(output) {
        return output.replace(/[\u001b][[0-?9;]*[mG]/g, "").trim();
      }

      // Inside your exec callback
      const studentOutput = sanitizeOutput(
        fs.readFileSync(outputFilePath, { encoding: "utf8" })
      );
      for (let testCase of problem.testCases) {
        if (studentOutput !== testCase.expectedOutput.trim()) {
          // Clean up files
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

      // All test cases passed, update balance
      const student = await Student.findById(req.user.id);
      student.balance += problem.point;
      await student.save();

      // Clean up files
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputFilePath);

      return res.json({
        data: {
          correct: true,
          balance: student.balance,
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

exports.createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    return res.status(201).json({ data: problem });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndUpdate(id, req.body);
    if (!problem) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Masala topilmadi",
          ru: "Задача не найдена",
          en: "Problem not found",
        },
      });
    }
    return res.status(200).json({ data: problem });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndDelete(id);
    if (!problem) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Masala topilmadi",
          ru: "Задача не найдена",
          en: "Problem not found",
        },
      });
    }
    return res.json({ data: problem });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};
