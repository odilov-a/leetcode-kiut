const path = require("path");
const multer = require("multer");
const Files = require("../models/File.js");
const mongoose = require("mongoose");

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
    const storage = multer.diskStorage({
      destination: publicFolderPath,
      filename: (req, file, cb) => {
        const fileId = new mongoose.Types.ObjectId().toString(); // Generate a new ObjectId for the file
        const fileExtension = path.extname(file.originalname); // Get the file extension
        const fileName = `${fileId}${fileExtension}`; // Construct file name
        cb(null, fileName); // Save the file with this name
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

      // Create new file entry after the upload is successful
      const newFile = new Files({
        fileName: req.file.filename, // Assign the uploaded file name
        fileUrl: `http://localhost:5001/uploads/${req.file.filename}`, // Construct the file URL
      });

      await newFile.save(); // Save the file record in the database

      return res.status(200).json({ data: newFile }); // Return the newly saved file info
    });
  } catch (error) {
    console.log(error);
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
