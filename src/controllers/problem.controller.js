const Problem = require("../models/Problem.js");

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
    return res.json({ data: result.reverse() });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
        ru: error.message,
        en: error.message,
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
    const lang = req.query.lang || "en";
    const titles = {
      uz: problem.titleUz,
      ru: problem.titleRu,
      en: problem.titleEn,
    };
    const descriptions = {
      uz: problem.descriptionUz,
      ru: problem.descriptionRu,
      en: problem.descriptionEn,
    };
    const subjectTitles = {
      uz: problem.subject?.titleUz,
      ru: problem.subject?.titleRu,
      en: problem.subject?.titleEn,
    };
    const difficultyTitles = {
      uz: problem.difficulty?.titleUz,
      ru: problem.difficulty?.titleRu,
      en: problem.difficulty?.titleEn,
    };
    return res.json({
      data: {
        _id: problem._id,
        title: titles[lang],
        description: descriptions[lang],
        point: problem.point,
        tutorials: problem.tutorials,
        testCases: problem.testCases,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        subject: {
          _id: problem.subject?._id,
          title: subjectTitles[lang],
        },
        difficulty: {
          _id: problem.difficulty?._id,
          title: difficultyTitles[lang],
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: "Server xatosi yuz berdi",
        ru: "Произошла ошибка сервера",
        en: "Server error occurred",
      },
    });
  }
};

exports.getAllProblemsByTeacher = async (req, res) => {
  try {
    if (!req.teacher || !req.teacher.id) {
      return res.status(401).json({
        status: "error",
        message: {
          uz: "Foydalanuvchi autentifikatsiyadan o'tmagan",
          ru: "Пользователь не аутентифицирован",
          en: "User not authenticated",
        },
      });
    }
    const teacherId = req.teacher.id;
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
    const problems = await Problem.find({ teacher: teacherId })
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
        uz: error.message,
        ru: error.message,
        en: error.message,
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

exports.searchProblems = async (req, res) => {
  try {
    const { search, lang } = req.query;
    const decodedSearch = decodeURIComponent(search);
    const regex = new RegExp(decodedSearch, "i");
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
        uz: error.message,
        ru: error.message,
        en: error.message,
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

exports.createProblem = async (req, res) => {
  try {
    if ((!req.admin || !req.admin.id) && (!req.teacher || !req.teacher.id)) {
      return res.status(401).json({
        status: "error",
        message: {
          uz: "Foydalanuvchi autentifikatsiyadan o'tmagan",
          ru: "Пользователь не аутентифицирован",
          en: "User not authenticated",
        },
      });
    }
    const teacherId = req.teacher ? req.teacher.id : null;
    const adminId = req.admin ? req.admin.id : null;
    const newProblem = new Problem({
      ...req.body,
      teacher: teacherId,
      admin: adminId,
    });
    await newProblem.save();
    return res.status(201).json({ data: newProblem });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
        ru: error.message,
        en: error.message,
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
