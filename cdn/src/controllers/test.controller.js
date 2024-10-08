const path = require("path");
const multer = require("multer");
const Test = require("../models/Test.js");
const mongoose = require("mongoose");

exports.getTest = async (req, res) => {
  try {
    const tests = await Test.find();
    return res.status(200).json({ data: tests });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.upload = async (req, res) => {
  try {
    const publicFolderPath = `./tests`;
    const storage = multer.diskStorage({
      destination: publicFolderPath,
      filename: (req, file, cb) => {
        const fileId = new mongoose.Types.ObjectId().toString();
        const fileExtension = path.extname(file.originalname);
        const fileName = `${fileId}${fileExtension}`;
        cb(null, fileName);
      },
    });
    const upload = multer({ storage }).single("file");
    upload(req, res, async (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: {
            uz: "Fayl yuklanmadi",
            ru: "Файл не загружен",
            en: "File not uploaded",
          },
        });
      }
      const newFile = new Files({
        fileName: req.file.filename,
        fileUrl: `http://localhost:5001/tests/${req.file.filename}`,
      });
      await newFile.save();
      return res.status(200).json({ data: newFile });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const file = await Test.findById(req.params.id);
    if (!file) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fayl topilmadi",
          ru: "Файл не найден",
          en: "File not found",
        },
      });
    }
    await file.deleteOne();
    return res.json({ data: file });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};
