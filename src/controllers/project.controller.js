const Project = require("../models/Project.js");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("subject")
      .populate("difficulty");
    return res.status(200).json({ data: projects });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("subject")
      .populate("difficulty");
    return res.status(200).json({ data: project });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectByTeacherId = async (req, res) => {
  try {
    const projects = await Project.find({ teacher: req.params.id })
      .populate("subject")
      .populate("difficulty");
    return res.status(200).json({ data: projects });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { titleUz: { $regex: req.query.title, $options: "i" } },
        { titleRu: { $regex: req.query.title, $options: "i" } },
        { titleEn: { $regex: req.query.title, $options: "i" } },
        { descriptionUz: { $regex: req.query.description, $options: "i" } },
        { descriptionRu: { $regex: req.query.description, $options: "i" } },
        { descriptionEn: { $regex: req.query.description, $options: "i" } },
      ],
    })
      .populate("subject")
      .populate("difficulty");
    return res.status(200).json({ data: projects });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    if ((!req.admin || !req.admin.id) && (!req.teacher || !req.teacher.id)) {
      return res.status(401).json({
        status: "error",
        message: {
          uz: "Foydalanuvchi autentifikatsiyadan o'tmagan",
          ru: "Пользователь не аутентифицирован",
          en: "User not authenticated",
        },
      });
    }
    const teacherId = req.teacher ? req.teacher.id : null;
    const adminId = req.admin ? req.admin.id : null;
    const newProject = new Project({
      ...req.body,
      teacher: teacherId,
      admin: adminId,
    });
    await newProject.save();
    return res.status(201).json({ data: newProject });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ data: updatedProject });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
