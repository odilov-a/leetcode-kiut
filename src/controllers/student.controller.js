const bcrypt = require("bcrypt");
const Student = require("../models/Student.js");
const Attempt = require("../models/Attempt.js");
const { sign } = require("../utils/jwt.js");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select(
      "balance firstName isActive lastName phoneNumber photoUrl username"
    );
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

exports.getAttemptByStudentId = async (req, res) => {
  try {
    const attempts = await Attempt.find({ studentId: req.params.id });
    return res.json({ data: attempts });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getAllStudentsHistory = async (req, res) => {
  try {
    const attempts = await Attempt.find().populate({
      path: "studentId",
      model: "students",
      select: "-password -photoUrl -role -createdAt -_id -history",
      strictPopulate: false,
    });
    const result = attempts.reverse();
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
        ru: error.message,
        en: error.message,
      },
    });
  }
};

exports.getMeStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);
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
    return res.status(200).json({
      data: {
        username: student.username,
        firstName: student.firstName,
        lastName: student.lastName,
        balance: student.balance,
        phoneNumber: student.phoneNumber,
        photoUrl: student.photoUrl,
        isActive: student.isActive,
      },
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

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
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
    const students = await Student.find()
      .sort({ balance: -1 })
      .select("balance firstName lastName username");
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
    const token = sign({
      id: student._id,
      role: student.role,
      username: student.username,
      createdAt: student.createdAt,
    });
    return res.status(201).json({
      data: {
        token,
        student,
      },
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
      id: student._id,
      role: student.role,
      username: student.username,
      createdAt: student.createdAt,
    });
    return res.status(200).json({
      data: {
        token,
        role: student.role,
        username: student.username,
        isActive: student.isActive,
      },
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

exports.meUpdateStudent = async (req, res) => {
  try {
    const { userId } = req;
    const { password, ...otherData } = req.body;
    let updateData = { ...otherData };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    const student = await Student.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
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
        ru: error.message,
        en: error.message,
      },
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    let updateData = { ...otherData };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
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
        ru: error.message,
        en: error.message,
      },
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
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
