const Chat = require("../models/Chat.js");
const Teacher = require("../models/Teacher.js");
const Student = require("../models/Student.js");
const Admin = require("../models/Admin.js");

exports.getAllTeachersStudentsAdmins = async (req, res) => {
  try {
    const teachers = await Teacher.find().select(
      "firstName lastName username role photoUrl"
    );
    const students = await Student.find().select(
      "firstName lastName username role photoUrl"
    );
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
    const receiverId = req.body.receiverId;
    const chat = new Chat({
      senderId: senderId,
      receiverId: receiverId,
      message: req.body.message,
      photoUrls: req.body.photoUrls,
    });
    const savedChat = await chat.save();
    const io = req.app.get("io");
    const room = `room_${senderId}_${receiverId}`;
    io.to(room).emit("newPrivateMessage", savedChat);
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
