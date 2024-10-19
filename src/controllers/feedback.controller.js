const Feedback = require("../models/Feedback.js");

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    return res.status(200).json({ data: feedbacks.reverse() });
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

exports.getFeedbacksByTeacherId = async (req, res) => {
  try {
    if (!req.teacher || !req.teacher.id) {
      return res.status(401).json({
        status: "error",
        message: {
          uz: "Foydalanuvchi autentifikatsiyadan o'tmagan",
          ru: "Пользователь не аутентифицирован",
          en: "User not authenticated",
        },
      });
    }
    const teacherId = req.teacher.id;
    const feedbacks = await Feedback.find({ teacher: teacherId });
    return res.status(200).json({ data: feedbacks.reverse() });
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

exports.getFeedbacksByStudentId = async (req, res) => {
  try {
    if (!req.student || !req.student.id) {
      return res.status(401).json({
        status: "error",
        message: {
          uz: "Foydalanuvchi autentifikatsiyadan o'tmagan",
          ru: "Пользователь не аутентифицирован",
          en: "User not authenticated",
        },
      });
    }
    const studentId = req.student.id;
    const feedbacks = await Feedback.find({ student: studentId });
    return res.status(200).json({ data: feedbacks.reverse() });
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

exports.getFeedbackWithId = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fikr topilmadi",
          ru: "Отзыв не найден",
          en: "Feedback not found",
        },
      });
    }
    return res.status(200).json({ data: feedback });
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

exports.createFeedback = async (req, res) => {
  try {
    if (
      (!req.student || !req.student.id) &&
      (!req.teacher || !req.teacher.id)
    ) {
      return res.status(401).json({
        status: "error",
        message: {
          uz: "Foydalanuvchi autentifikatsiyadan o'tmagan",
          ru: "Пользователь не аутентифицирован",
          en: "User not authenticated",
        },
      });
    }
    const studentId = req.student ? req.student.id : null;
    const teacherId = req.teacher ? req.teacher.id : null;
    const newFeedback = new Feedback({
      ...req.body,
      student: studentId,
      teacher: teacherId,
    });
    await newFeedback.save();
    return res.status(201).json({ data: newFeedback });
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

exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fikr topilmadi",
          ru: "Отзыв не найден",
          en: "Feedback not found",
        },
      });
    }
    await feedback.updateOne(req.body);
    return res.status(200).json({ data: feedback });
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

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Fikr topilmadi",
          ru: "Отзыв не найден",
          en: "Feedback not found",
        },
      });
    }
    return res.status(200).json({ data: feedback });
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
