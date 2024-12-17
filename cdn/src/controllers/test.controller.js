const path = require("path");
const multer = require("multer");
const Test = require("../models/Test.js");
const mongoose = require("mongoose");

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
        return res.status(400).json({ message: "File not found" });
      }
      const newFile = new Test({
        fileName: req.file.filename,
        fileUrl: `https://cdn.uzcontest.uz/tests/${req.file.filename}`,
      });
      await newFile.save();
      return res.status(200).json({ data: newFile });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
