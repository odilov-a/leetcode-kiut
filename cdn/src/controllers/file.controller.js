const path = require("path");
const multer = require("multer");
const Files = require("../models/File.js");

exports.getFiles = async (req, res) => {
  try {
    const files = await Files.find();
    return res.status(200).json({ data: files });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: "Server xatosi",
        ru: "Ошибка сервера",
        en: "Server error",
      },
    });
  }
};

exports.upload = async (req, res) => {
  try {
    const publicFolderPath = `./uploads`;
    const newFile = new Files();
    await newFile.save();
    const storage = multer.diskStorage({
      destination: publicFolderPath,
      filename: (req, file, cb) => {
        const fileId = newFile._id.toString();
        const fileExtension = path.extname(file.originalname);
        const fileName = `${fileId}${fileExtension}`;
        cb(null, fileName);
      },
    });
    const upload = multer({ storage }).single("file");
    upload(req, res, async (error) => {
      if (error) {
        return res.status(500).json(error.message);
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
      newFile.fileName = req.file.filename;
      newFile.fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
      await newFile.save();
      return res.status(200).json({ data: newFile });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: "Server xatosi",
        ru: "Ошибка сервера",
        en: "Server error",
      },
    });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await Files.findById(id);
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
        uz: "Server xatosi",
        ru: "Ошибка сервера",
        en: "Server error",
      },
    });
  }
};

exports.deleteAllFiles = async (req, res) => {
  try {
    await Files.deleteMany();
    return res.json({ data: [] });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: "Server xatosi",
        ru: "Ошибка сервера",
        en: "Server error",
      },
    });
  }
};