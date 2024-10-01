const Difficulty = require("../models/Difficulty.js");

function getLanguageField(lang) {
  const langFieldMap = {
    uz: "titleUz",
    ru: "titleRu",
    en: "titleEn",
  };
  return langFieldMap[lang];
}

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
      if (fieldName) {
        return {
          id: difficulty._id,
          titleUz: difficulty.titleUz,
          titleRu: difficulty.titleRu,
          titleEn: difficulty.titleEn,
          title: difficulty[fieldName],
        };
      }
      return difficulty;
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

exports.getDifficultyById = async (req, res) => {
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
    const difficulty = await Difficulty.findById(id);
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
      id: difficulty._id,
      titleUz: difficulty.titleUz,
      titleRu: difficulty.titleRu,
      titleEn: difficulty.titleEn,
      title: difficulty[fieldName],
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
    const difficulty = Difficulty.create(req.body);
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
    const { id } = req.params;
    const difficulty = await Difficulty.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
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
    return res.status(200).json({ data: difficulty });
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
    const { id } = req.params;
    const difficulty = await Difficulty.findByIdAndDelete(id);
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
    return res.status(200).json({
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
