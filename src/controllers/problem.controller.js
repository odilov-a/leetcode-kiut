const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const Problem = require("../models/Problem.js");
const Student = require("../models/Student.js");
const { getTranslation } = require("../helpers/helper.js");

const getLanguageField = (lang, type) => {
  switch (type) {
    case "title":
      switch (lang) {
        case "uz":
          return "titleUz";
        case "ru":
          return "titleRu";
        case "en":
          return "titleEn";
        default:
          return null;
      }
    case "description":
      switch (lang) {
        case "uz":
          return "descriptionUz";
        case "ru":
          return "descriptionRu";
        case "en":
          return "descriptionEn";
        default:
          return null;
      }
    default:
      return null;
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const { lang } = req.query;
    const titleFieldName = getLanguageField(lang, "title");
    const descriptionFieldName = getLanguageField(lang, "description");
    if (lang && (!titleFieldName || !descriptionFieldName)) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Noto'g'ri til so'rovi",
          ru: "Неверный запрос языка",
          en: "Invalid language request",
        },
      });
    }
    const problems = await Problem.find()
      .populate("subject")
      .populate("difficulty");
    const result = problems.map((problem) => {
      const subjectTitle = titleFieldName
        ? problem.subject[titleFieldName]
        : problem.subject.titleEn;

      const difficultyTitle = titleFieldName
        ? problem.difficulty[titleFieldName]
        : problem.difficulty.titleEn;
      return {
        _id: problem._id,
        titleUz: problem.titleUz,
        titleRu: problem.titleRu,
        titleEn: problem.titleEn,
        title: titleFieldName ? problem[titleFieldName] : problem.titleEn,
        descriptionUz: problem.descriptionUz,
        descriptionRu: problem.descriptionRu,
        descriptionEn: problem.descriptionEn,
        description: descriptionFieldName
          ? problem[descriptionFieldName]
          : problem.descriptionEn,
        point: problem.point,
        tutorials: problem.tutorials,
        testCases: problem.testCases,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        subject: {
          _id: problem.subject._id,
          title: subjectTitle,
        },
        difficulty: {
          _id: problem.difficulty._id,
          title: difficultyTitle,
        },
      };
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: "Xatolik sodir bo'ldi",
        ru: "Произошла ошибка",
        en: "An error occurred",
      },
    });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
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
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
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
    const problem = await Problem.findByIdAndDelete(req.params.id);
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
