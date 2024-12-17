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
      return res.status(400).json({ message: "Invalid language request" });
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
    return res.status(500).json({ error: error.message });
  }
};

exports.getDifficultyById = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({ message: "Invalid language request" });
    }
    const difficulty = await Difficulty.findById(req.params.id);
    if (!difficulty) {
      return res.status(404).json({ message: "Difficulty not found" });
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
    return res.status(500).json({ error: error.message });
  }
};

exports.createDifficulty = async (req, res) => {
  try {
    const { titleUz, titleRu, titleEn } = req.body;
    if (!titleUz || !titleRu || !titleEn) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const difficulty = await Difficulty.create({ ...req.body });
    return res.status(201).json({ data: difficulty });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
      return res.status(404).json({ message: "Difficulty not found" });
    }
    return res.json({ data: difficulty });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDifficulty = async (req, res) => {
  try {
    const difficulty = await Difficulty.findByIdAndDelete(req.params.id);
    if (!difficulty) {
      return res.status(404).json({ message: "Difficulty not found" });
    }
    return res.json({ message: "Difficulty deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
