const Subject = require("../models/Subject.js");

const getLanguageField = (lang) => {
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
};

exports.getAllSubjects = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Noto'g'ri til so'rovi",
          ru: "Неверный запрос языка",
          en: "Invalid language request",
        },
      });
    }
    const subjects = await Subject.find();
    const result = subjects.map((subject) => {
      return {
        _id: subject._id,
        titleUz: subject.titleUz,
        titleRu: subject.titleRu,
        titleEn: subject.titleEn,
        title: fieldName ? subject[fieldName] : undefined,
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

exports.getSubjectById = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Noto'g'ri til so'rovi",
          ru: "Неверный запрос языка",
          en: "Invalid language request",
        },
      });
    }
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fan topilmadi",
          ru: "Предмет не найден",
          en: "Subject not found",
        },
      });
    }
    const result = {
      _id: subject._id,
      titleUz: subject.titleUz,
      titleRu: subject.titleRu,
      titleEn: subject.titleEn,
      title: fieldName ? subject[fieldName] : undefined,
    };
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

exports.getAllSubjectsByTeacher = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Noto'g'ri til so'rovi",
          ru: "Неверный запрос языка",
          en: "Invalid language request",
        },
      });
    }
    const subjects = await Subject.find({ teacher: req.params.id });
    const result = subjects.map((subject) => {
      return {
        _id: subject._id,
        titleUz: subject.titleUz,
        titleRu: subject.titleRu,
        titleEn: subject.titleEn,
        title: fieldName ? subject[fieldName] : undefined,
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

exports.createSubject = async (req, res) => {
  try {
    const { titleUz, titleRu, titleEn } = req.body;
    if (!titleUz || !titleRu || !titleEn) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Barcha maydonlar to'ldirilishi shart",
          ru: "Все поля должны быть заполнены",
          en: "All fields are required",
        },
      });
    }
    const subject = await Subject.create({ ...req.body });
    return res.status(201).json({ data: subject });
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

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!subject) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fan topilmadi",
          ru: "Предмет не найден",
          en: "Subject not found",
        },
      });
    }
    return res.status(200).json({ data: subject });
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

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fan topilmadi",
          ru: "Предмет не найден",
          en: "Subject not found",
        },
      });
    }
    return res.json({
      status: "success",
      message: {
        uz: "Fan o'chirildi",
        ru: "Предмет удален",
        en: "Subject deleted",
      },
    });
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
