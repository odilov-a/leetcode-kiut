const Subject = require("../models/Subject.js");

function getLanguageField(lang) {
  const langFieldMap = {
    uz: "titleUz",
    ru: "titleRu",
    en: "titleEn",
  };
  return langFieldMap[lang];
}

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
      if (fieldName) {
        return {
          id: subject._id,
          titleUz: subject.titleUz,
          titleRu: subject.titleRu,
          titleEn: subject.titleEn,
          title: subject[fieldName],
        };
      }
      return subject;
    });
    return res.status(200).json({ data: result });
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
    const { id } = req.params;
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
    const subject = await Subject.findById(id);
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
      id: subject._id,
      titleUz: subject.titleUz,
      titleRu: subject.titleRu,
      titleEn: subject.titleEn,
      title: subject[fieldName],
    };
    return res.status(200).json({ data: result });
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
    const subject = await Subject.create(req.body);
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
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
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
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
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
    return res.status(200).json({
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

exports.deleteAllSubjects = async (req, res) => {
  try {
    await Subject.deleteMany();
    return res.status(200).json({
      status: "success",
      message: {
        uz: "Barcha fanlar o'chirildi",
        ru: "Все предметы удалены",
        en: "All subjects deleted",
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
