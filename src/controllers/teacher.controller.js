const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher.js");
const { sign } = require("../utils/jwt.js");

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("subject");
    return res.json({ data: teachers });
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

exports.getMeTeacher = async (req, res) => {
  try {
    const teacher = await req.teacher;
    if (!teacher) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "O'qituvchi topilmadi",
          ru: "Учитель не найден",
          en: "Teacher not found",
        },
      });
    }
    const token = sign({
      id: teacher._id,
      role: teacher.role,
      username: teacher.username,
      createdAt: teacher.createdAt,
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

exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).populate("subject");
    if (!teacher) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "O'qituvchi topilmadi",
          ru: "Учитель не найден",
          en: "Teacher not found",
        },
      });
    }
    return res.json({ data: teacher });
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

exports.registerTeacher = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const teacher = new Teacher({
      ...otherData,
      password: hashedPassword,
    });
    await teacher.save();
    return res.status(201).json({ data: teacher });
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

exports.loginTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;
    const teacher = await Teacher.findOne({ username });
    if (!teacher) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "O'qituvchi topilmadi",
          ru: "Учитель не найден",
          en: "Teacher not found",
        },
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, teacher.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Parol noto'g'ri",
          ru: "Неверный пароль",
          en: "Incorrect password",
        },
      });
    }
    const token = sign({
      id: teacher._id,
      role: teacher.role,
      username: teacher.username,
      createdAt: teacher.createdAt,
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

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...otherData } = req.body;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "O'qituvchi topilmadi",
          ru: "Учитель не найден",
          en: "Teacher not found",
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await teacher.updateOne({ ...otherData, password: hashedPassword });
    return res.json({ data: teacher });
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

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "O'qituvchi topilmadi",
          ru: "Учитель не найден",
          en: "Teacher not found",
        },
      });
    }
    await teacher.deleteOne();
    return res.json({ data: teacher });
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
