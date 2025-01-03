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

exports.getPereviewsStutus = async (req, res) => {
  try {
    const studentId = req.userId;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const pereviews = await Pereview.find({ student: studentId }).populate({
      path: "pereviewer",
      model: "students",
      select: "-password -photoUrl -role -createdAt -_id -history",
      strictPopulate: false,
    });
    const result = pereviews.map((pereview) => {
      return {
        _id: pereview._id,
        projectUrl: pereview.projectUrl,
        isCorrect: pereview.isCorrect,
        isMarked: pereview.isMarked,
        isTeacherMarked: pereview.isTeacherMarked,
        pereviewer: pereview.pereviewer,
        pereviewerComment: pereview.pereviewerComment,
        teacherComment: pereview.teacherComment,
        createdAt: pereview.createdAt,
      };
    });
    return res.status(200).json({ data: result.reverse() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.submitProjectToPereview = async (req, res) => {
  try {
    const { projectId, projectUrl, teacher } = req.body;
    const urlPattern =
      /^(https?:\/\/)?(www\.)?(github|gitlab)\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;
    if (!urlPattern.test(projectUrl)) {
      return res.status(400).json({ message: "Invalid project URL" });
    }
    const studentId = req.userId;
    const pereviewerId = req.userId;
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
      isTeacherMarked: false,
      pereviewer: pereviewerId,
      teacher,
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
      return res.status(400).json({ message: "Invalid language request" });
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
        pereviewerComment: pereview.pereviewerComment,
        teacherComment: pereview.teacherComment,
        isTeacherMarked: pereview.isTeacherMarked,
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

exports.getPereviewByTeacherId = async (req, res) => {
  try {
    const teacherId = req.userId;
    const pereviews = await Pereview.find({ teacher: teacherId })
      .populate("pereviewer", "firstName lastName")
      .populate("student", "firstName lastName")
      .populate("project", "titleUz titleRu titleEn");
    if (!pereviews) {
      return res.status(404).json({ message: "Pereviews not found" });
    }
    const result = pereviews.map((pereview) => {
      const projectTitle = pereview.project.titleEn;
      return {
        _id: pereview._id,
        createdAt: pereview.createdAt,
        isCorrect: pereview.isCorrect,
        isMarked: pereview.isMarked,
        isTeacherMarked: pereview.isTeacherMarked,
        projectUrl: pereview.projectUrl,
        pereviewer: {
          firstName: pereview.pereviewer.firstName,
          lastName: pereview.pereviewer.lastName,
        },
        project: {
          title: projectTitle,
        },
        student: {
          firstName: pereview.student.firstName,
          lastName: pereview.student.lastName,
        },
      };
    });
    return res.status(200).json({ data: result.reverse() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updatePereview = async (req, res) => {
  try {
    const pereviewerId = req.userId;
    const { isCorrect, pereviewerComment } = req.body;
    const updatedPereview = await Pereview.findByIdAndUpdate(
      req.params.id,
      {
        isCorrect,
        pereviewerComment,
        pereviewer: pereviewerId,
      },
      { new: true }
    );
    if (!updatedPereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    return res.status(200).json({ data: updatedPereview });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateIsTeacherMarked = async (req, res) => {
  try {
    const { isTeacherMarked, teacherComment } = req.body;
    const pereview = await Pereview.findById(req.params.id);
    if (!pereview) {
      return res.status(404).json({ message: "Pereview not found" });
    }
    const updatedPereview = await Pereview.findByIdAndUpdate(
      req.params.id,
      {
        isTeacherMarked,
        teacherComment,
        isMarked: true,
        pereviewer: pereview.pereviewer,
      },
      { new: true }
    );
    const studentId = updatedPereview.student;
    if (isTeacherMarked) {
      const project = await Project.findById(updatedPereview.project);
      if (project) {
        await Student.findByIdAndUpdate(studentId, {
          $inc: { balance: project.point },
        });
        if (updatedPereview.pereviewer) {
          await Student.findByIdAndUpdate(updatedPereview.pereviewer, {
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
