const Project = require("../models/Project.js");
const Student = require("../models/Student.js");
const Pereview = require("../models/Pereview.js");

exports.submitProjectToPereview = async (req, res) => {
  try {
    const { projectId, projectUrl } = req.body;
    const urlPattern = new RegExp(
      /^(https?:\/\/)?(www\.)?(github|gitlab)\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/
    );
    if (!urlPattern.test(projectUrl)) {
      return res.status(400).json({ message: "Invalid project URL" });
    }
    const studentId = req.userId;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const pereview = new Pereview({
      student: studentId,
      project: projectId,
      projectUrl,
      isCorrect: false,
      isMarked: false,
    });
    await pereview.save();
    return res.status(201).json({ message: "Project submitted for review" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getRandomProjectForReview = async (req, res) => {
  try {
    const studentId = req.userId;
    const pendingProjects = await Pereview.find({ 
      isMarked: false, 
      student: { $ne: studentId }
    });
    if (pendingProjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects available for review" });
    }
    const randomIndex = Math.floor(Math.random() * pendingProjects.length);
    const randomProject = pendingProjects[randomIndex];
    return res.status(200).json({ data: randomProject });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPereview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const pereview = await Pereview.findOne({ project: projectId });
    if (!pereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    return res.status(200).json({ data: pereview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPereviewByReviewer = async (req, res) => {
  try {
    const { reviewerId } = req.params;
    const pereview = await Pereview.findOne({ pereviewer: reviewerId });
    if (!pereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    return res.status(200).json({ data: pereview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPereviewById = async (req, res) => {
  try {
    const pereview = await Pereview.findById(req.params.id);
    if (!pereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    return res.status(200).json({ data: pereview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updatePereview = async (req, res) => {
  try {
    const { isCorrect } = req.body;
    const updatedPereview = await Pereview.findByIdAndUpdate(
      req.params.id,
      { isCorrect, isMarked: true },
      { new: true }
    );
    if (!updatedPereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    const studentId = updatedPereview.student;
    if (isCorrect && !updatedPereview.isCorrect) {
      const project = await Project.findById(updatedPereview.project);
      if (project) {
        await Student.findByIdAndUpdate(studentId, {
          $inc: { balance: project.point },
        });
      }
    }
    return res.status(200).json({ data: updatedPereview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
