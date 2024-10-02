const bcrypt = require("bcrypt");
const Student = require("../models/Student.js");
const { sign } = require("../utils/jwt.js");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return res.json({ data: students });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getMeStudent = async (req, res) => {
  try {
    const student = await req.student;
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Student topilmadi",
          ru: "Студент не найден",
          en: "Student not found",
        },
      });
    }
    const token = sign({
      id: student._id,
      role: student.role,
      username: student.username,
      createdAt: student.createdAt,
    });
    return res.status(200).json({ data: token });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Student topilmadi",
          ru: "Студент не найден",
          en: "Student not found",
        },
      });
    }
    return res.json({ data: student });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getTopStudentsByBalance = async (req, res) => {
  try {
    const students = await Student.find().sort({ balance: -1 });
    return res.json({ data: students });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const student = new Student({
      ...otherData,
      password: hashedPassword,
    });
    await student.save();
    return res.status(201).json({ data: student });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Student topilmadi",
          ru: "Студент не найден",
          en: "Student not found",
        },
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, student.password);
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
      id: student._id.toString(),
      role: student.role,
      username: student.username,
      createdAt: student.createdAt,
    });
    return res.status(200).json({ data: token });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...otherData } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Student topilmadi",
          ru: "Студент не найден",
          en: "Student not found",
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await student.updateOne({ ...otherData, password: hashedPassword });
    return res.json({ data: student });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Student topilmadi",
          ru: "Студент не найден",
          en: "Student not found",
        },
      });
    }
    await student.deleteOne();
    return res.json({ data: student });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.deleteAllStudents = async (req, res) => {
  try {
    await Student.deleteMany();
    return res.json({ data: [] });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};
