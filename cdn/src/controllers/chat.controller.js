const path = require("path");
const multer = require("multer");
const Chat = require("../models/Chat.js");
const mongoose = require("mongoose");

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    return res.status(200).json({ data: chats });
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
    const publicFolderPath = `./images`;
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
      const newFile = new Chat({
        fileName: req.file.filename,
        fileUrl: `https://cdn.uzcontest.uz/images/${req.file.filename}`,
      });
      await newFile.save();
      return res.status(200).json({ data: newFile });
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};
