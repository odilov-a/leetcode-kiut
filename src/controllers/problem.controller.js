const Problem = require("../models/Problem.js");
const Student = require("../models/Student.js");

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

exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    const problem = await Problem.findById(id);
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
    if (problem.answer === answer) {
      const student = await Student.findById(req.user.id);
      if (!student) {
        return res.status(404).json({
          status: "error",
          message: {
            uz: "Talaba topilmadi",
            ru: "Студент не найден",
            en: "Student not found",
          },
        });
      }
      student.balance += problem.point;
      await student.save();
      return res.json({
        data: {
          correct: true,
          balance: student.balance,
        },
      });
    } else {
      return res.json({
        data: {
          correct: false,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
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
