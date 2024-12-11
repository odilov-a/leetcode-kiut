const bcrypt = require("bcrypt");
const Teacher = require("../models/Teacher.js");
const { sign } = require("../utils/jwt.js");

const getLanguageField = (lang) => {
  switch (lang) {
    case "uz":
      return "titleUz";
    case "ru":
      return "titleRu";
    case "en":
      return "titleEn";
    default:
      return null;
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Noto'g'ri til so'rovi",
          ru: "Неверный запрос языка",
          en: "Invalid language request",
        },
      });
    }
    const teachers = await Teacher.find()
      .populate("subject")
      .select("-password -createdAt");
    const result = teachers.map((teacher) => {
      const modifiedSubjects = teacher.subject.map((subject) => {
        return {
          _id: subject._id,
          titleUz: subject.titleUz,
          titleRu: subject.titleRu,
          titleEn: subject.titleEn,
          title: fieldName ? subject[fieldName] : undefined,
        };
      });
      return {
        ...teacher._doc,
        subject: modifiedSubjects,
      };
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: "Xatolik sodir bo'ldi",
        ru: "Произошла ошибка",
        en: "An error occurred",
      },
    });
  }
};

exports.getMeTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).populate("subject");
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
    const lang = req.query.lang || "uz";
    const subjects = teacher.subject.map((sub) => {
      return {
        _id: sub._id,
        title: sub[`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`],
        createdAt: sub.createdAt,
      };
    });
    return res.status(200).json({
      data: {
        username: teacher.username,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        phoneNumber: teacher.phoneNumber,
        photoUrl: teacher.photoUrl,
        subject: subjects,
      },
    });
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

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("subject");
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
        uz: error.message,
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
    const token = sign({
      id: teacher._id,
      role: teacher.role,
      username: teacher.username,
      createdAt: teacher.createdAt,
    });
    return res.status(201).json({
      data: {
        token,
        teacher,
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
    return res.status(200).json({
      data: {
        token,
        role: teacher.role,
        username: teacher.username,
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

exports.meUpdateTeacher = async (req, res) => {
  try {
    const { userId } = req;
    const { password, ...otherData } = req.body;
    let updateData = { ...otherData };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    const teacher = await Teacher.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
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
        uz: error.message,
        ru: error.message,
        en: error.message,
      },
    });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    const updateData = { ...otherData };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
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
        uz: error.message,
      },
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
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
        uz: error.message,
      },
    });
  }
};
