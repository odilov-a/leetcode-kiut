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
    return res.status(200).json({
      data: {
        token,
        role: student.role,
        username: student.username,
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

exports.getAllExtraUsers = async (req, res) => {
  try {
    const extraUsers = await Student.find({ isExtra: true });
    return res.json({ data: extraUsers });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.deleteOneExtraUser = async (req, res) => {
  try {
    const extraUser = await Student.findOneAndDelete({
      isExtra: true,
      _id: req.params.id,
    });
    if (!extraUser) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Extra foydalanuvchi topilmadi",
          ru: "Дополнительный пользователь не найден",
          en: "Extra user not found",
        },
      });
    }
    return res.json({ data: extraUser });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.deleteExtraUsers = async (req, res) => {
  try {
    const result = await Student.deleteMany({ isExtra: true });
    return res.status(200).json({
      message: `${result.deletedCount} extra users deleted successfully.`,
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

exports.generateExtraUsers = async (req, res) => {
  try {
    const { count } = req.body;
    if (!count || typeof count !== "number") {
      return res.status(400).json({ message: "Invalid count" });
    }
    const users = [];
    for (let i = 0; i < count; i++) {
      const extraUser = new Student({
        firstName: "Extra",
        lastName: "User",
        password: await bcrypt.hash("password123", 10),
        username: `extra_user_${Date.now()}_${i}`,
        phoneNumber: `+12${Date.now()}`,
        photoUrl: "https://cabinet.kiut.uz/assets/white-logo-CYUK7hbN.png",
        isExtra: true,
      });
      users.push(extraUser);
    }
    await Student.insertMany(users);
    return res.status(201).json({
      message: `${count} extra users created successfully.`,
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
