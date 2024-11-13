const Project = require("../models/Project.js");
const Student = require("../models/Student.js");
const Pereview = require("../models/Pereview.js");

const getLanguageField = (lang, type) => {
  switch (type) {
    case "title":
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
    case "description":
      switch (lang) {
        case "uz":
          return "descriptionUz";
        case "ru":
          return "descriptionRu";
        case "en":
          return "descriptionEn";
        default:
          return null;
      }
    default:
      return null;
  }
};

exports.submitProjectToPereview = async (req, res) => {
  try {
    const { projectId, projectUrl } = req.body;
    const urlPattern =
      /^(https?:\/\/)?(www\.)?(github|gitlab)\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;
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
      pereviewer: req.userId,
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
      student: { $ne: studentId },
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

exports.getAllMarkedPereviews = async (req, res) => {
  try {
    const { lang } = req.query;
    const titleFieldName = getLanguageField(lang, "title");
    const descriptionFieldName = getLanguageField(lang, "description");
    if (lang && (!titleFieldName || !descriptionFieldName)) {
      return res.status(400).json({
        status: "error",
        message: {
          uz: "Noto'g'ri til so'rovi",
          ru: "Неверный запрос языка",
          en: "Invalid language request",
        },
      });
    }
    const pereviews = await Pereview.find({ isMarked: true })
      .populate("student")
      .populate("project")
      .populate("pereviewer");
    const result = pereviews.map((pereview) => {
      const project = pereview.project;
      const student = pereview.student;
      return {
        _id: pereview._id,
        student: {
          isActive: student.isActive,
          username: student.username,
          firstName: student.firstName,
          lastName: student.lastName,
          phoneNumber: student.phoneNumber,
        },
        pereviewer: pereview.pereviewer,
        projectUrl: pereview.projectUrl,
        isCorrect: pereview.isCorrect,
        isMarked: pereview.isMarked,
        createdAt: pereview.createdAt,
        title: titleFieldName ? project[titleFieldName] : project.titleEn,
        description: descriptionFieldName
          ? project[descriptionFieldName]
          : project.descriptionEn,
      };
    });
    return res.status(200).json({ data: result.reverse() });
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
      { isCorrect, isMarked: true, pereviewer: req.userId },
      { new: true }
    );
    if (!updatedPereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    const studentId = updatedPereview.student;
    const reviewerId = updatedPereview.pereviewer;
    if (isCorrect && !updatedPereview.isCorrect) {
      const project = await Project.findById(updatedPereview.project);
      if (project) {
        await Student.findByIdAndUpdate(studentId, {
          $inc: { balance: project.point },
        });
        if (reviewerId) {
          await Student.findByIdAndUpdate(reviewerId, {
            $inc: { balance: project.pointForPereviwer },
          });
        }
      }
    }
    return res.status(200).json({ data: updatedPereview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
