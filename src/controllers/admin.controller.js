const bcrypt = require("bcrypt");
const Admin = require("../models/Admin.js");
const { sign } = require("../utils/jwt.js");

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    return res.json({ data: admins });
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

exports.getMeAdmin = async (req, res) => {
  try {
    const admin = await req.admin;
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Admin topilmadi",
          ru: "Админ не найден",
          en: "Admin not found",
        },
      });
    }
    const token = sign({
      id: admin._id,
      role: admin.role,
      date: new Date(),
      username: admin.username,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
    return res.status(200).json({ data: token });
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

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Admin topilmadi",
          ru: "Админ не найден",
          en: "Admin not found",
        },
      });
    }
    return res.json({ data: admin });
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

exports.registerAdmin = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({
      ...otherData,
      password: hashedPassword,
    });
    await admin.save();
    return res.status(201).json({ data: admin });
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

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Admin topilmadi",
          ru: "Админ не найден",
          en: "Admin not found",
        },
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Parol xato",
          ru: "Неверный пароль",
          en: "Incorrect password",
        },
      });
    }
    const token = sign({
      id: admin._id,
      role: admin.role,
      date: new Date(),
      username: admin.username,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
    return res.status(200).json({ data: token });
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

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Admin topilmadi",
          ru: "Админ не найден",
          en: "Admin not found",
        },
      });
    }
    return res.status(200).json({ data: admin });
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

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Admin topilmadi",
          ru: "Админ не найден",
          en: "Admin not found",
        },
      });
    }
    return res.json({ data: admin });
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
