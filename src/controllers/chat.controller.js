const Chat = require("../models/Chat.js");
const Teacher = require("../models/Teacher.js");
const Student = require("../models/Student.js");
const Admin = require("../models/Admin.js");

exports.getAllTeachersStudentsAdmins = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("firstName lastName username role");
    const students = await Student.find().select("firstName lastName username role");
    const admins = await Admin.find().select("username role");
    return res.status(200).json({ data: { teachers, students, admins } });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.searchTeachersStudentsAdminsByUserName = async (req, res) => {
  try {
    const teachers = await Teacher.find({
      username: { $regex: req.params.username, $options: "i" },
    }).select("firstName lastName username role");
    const students = await Student.find({
      username: { $regex: req.params.username, $options: "i" },
    }).select("firstName lastName username role");
    const admins = await Admin.find({
      username: { $regex: req.params.username, $options: "i" },
    }).select("username role");
    return res.status(200).json({ data: { teachers, students, admins } });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.createChat = async (req, res) => {
  try {
    const senderId = req.userId;
    const senderRole = req.body.senderRole;
    if (req.body.senderRole !== senderRole) {
      return res.status(403).json({
        status: "error",
        message: {
          uz: "You are not allowed to send messages on behalf of another user",
        },
      });
    }
    const receiver = req.body.receiverId;
    if (req.body.receiverRole === "teacher") {
      const teacher = await Teacher.findById(receiver);
      if (!teacher) {
        return res.status(404).json({
          status: "error",
          message: {
            uz: "Teacher not found",
          },
        });
      }
    } else if (req.body.receiverRole === "student") {
      const student = await Student.findById(receiver);
      if (!student) {
        return res.status(404).json({
          status: "error",
          message: {
            uz: "Student not found",
          },
        });
      }
    } else if (req.body.receiverRole === "admin") {
      const admin = await Admin.findById(receiver);
      if (!admin) {
        return res.status(404).json({
          status: "error",
          message: {
            uz: "Admin not found",
          },
        });
      }
    } else {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Invalid receiver role",
        },
      });
    }
    const chat = new Chat({
      senderId: senderId,
      senderRole: senderRole,
      receiverId: receiver,
      receiverRole: req.body.receiverRole,
      message: req.body.message,
      photoUrls: req.body.photoUrls,
    });
    const savedChat = await chat.save();
    return res.status(201).json({ data: savedChat });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        uz: error.message,
      },
    });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }],
    });
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
