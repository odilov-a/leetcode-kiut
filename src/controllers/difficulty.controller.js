const Difficulty = require("../models/Difficulty.js");

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

exports.getAllDifficulties = async (req, res) => {
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
    const difficulties = await Difficulty.find();
    const result = difficulties.map((difficulty) => {
      return {
        _id: difficulty._id,
        titleUz: difficulty.titleUz,
        titleRu: difficulty.titleRu,
        titleEn: difficulty.titleEn,
        title: fieldName ? difficulty[fieldName] : undefined,
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

exports.getDifficultyById = async (req, res) => {
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
    const difficulty = await Difficulty.findById(req.params.id);
    if (!difficulty) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Daraja topilmadi",
          ru: "Сложность не найдена",
          en: "Difficulty not found",
        },
      });
    }
    const result = {
      _id: difficulty._id,
      titleUz: difficulty.titleUz,
      titleRu: difficulty.titleRu,
      titleEn: difficulty.titleEn,
      title: fieldName ? difficulty[fieldName] : undefined,
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

exports.createDifficulty = async (req, res) => {
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
    const difficulty = await Difficulty.create({ ...req.body });
    return res.status(201).json({ data: difficulty });
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

exports.updateDifficulty = async (req, res) => {
  try {
    const difficulty = await Difficulty.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!difficulty) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Daraja topilmadi",
          ru: "Сложность не найдена",
          en: "Difficulty not found",
        },
      });
    }
    return res.json({ data: difficulty });
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

exports.deleteDifficulty = async (req, res) => {
  try {
    const difficulty = await Difficulty.findByIdAndDelete(req.params.id);
    if (!difficulty) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Daraja topilmadi",
          ru: "Сложность не найдена",
          en: "Difficulty not found",
        },
      });
    }
    return res.json({
      status: "success",
      message: {
        uz: "Daraja o'chirildi",
        ru: "Сложность удалена",
        en: "Difficulty deleted",
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
