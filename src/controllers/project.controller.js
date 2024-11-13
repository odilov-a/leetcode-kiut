const Project = require("../models/Project.js");

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

exports.getAllProjects = async (req, res) => {
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
    const projects = await Project.find()
      .populate("subject")
      .populate("difficulty");
    const result = projects.map((project) => {
      const subjectTitle = titleFieldName
        ? project.subject[titleFieldName]
        : project.subject.titleEn;
      const difficultyTitle = titleFieldName
        ? project.difficulty[titleFieldName]
        : project.difficulty.titleEn;
      return {
        _id: project._id,
        titleUz: project.titleUz,
        titleRu: project.titleRu,
        titleEn: project.titleEn,
        title: titleFieldName ? project[titleFieldName] : project.titleEn,
        descriptionUz: project.descriptionUz,
        descriptionRu: project.descriptionRu,
        descriptionEn: project.descriptionEn,
        description: descriptionFieldName
          ? project[descriptionFieldName]
          : project.descriptionEn,
        point: project.point,
        pointForPereviwer: project.pointForPereviwer,
        tutorials: project.tutorials,
        subject: {
          _id: project.subject._id,
          title: subjectTitle,
        },
        difficulty: {
          _id: project.difficulty._id,
          title: difficultyTitle,
        },
      };
    });
    return res.status(200).json({ data: result.reverse() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("subject")
      .populate("difficulty");
    if (!project) {
      return res.status(404).json({
        status: "error",
        message: {
          uz: "Masala topilmadi",
          ru: "Задача не найдена",
          en: "Problem not found",
        },
      });
    }
    const lang = req.query.lang || "en";
    const titles = {
      uz: project.titleUz,
      ru: project.titleRu,
      en: project.titleEn,
    };
    const descriptions = {
      uz: project.descriptionUz,
      ru: project.descriptionRu,
      en: project.descriptionEn,
    };
    const subjectTitles = {
      uz: project.subject?.titleUz,
      ru: project.subject?.titleRu,
      en: project.subject?.titleEn,
    };
    const difficultyTitles = {
      uz: project.difficulty?.titleUz,
      ru: project.difficulty?.titleRu,
      en: project.difficulty?.titleEn,
    };
    return res.json({
      data: {
        _id: project._id,
        title: titles[lang],
        description: descriptions[lang],
        point: project.point,
        pointForPereviwer: project.pointForPereviwer,
        tutorials: project.tutorials,
        subject: {
          _id: project.subject?._id,
          title: subjectTitles[lang],
        },
        difficulty: {
          _id: project.difficulty?._id,
          title: difficultyTitles[lang],
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectByTeacherId = async (req, res) => {
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
    const projects = await Project.find({ teacher: teacherId })
      .populate("subject")
      .populate("difficulty");
    const result = projects.map((project) => {
      const subjectTitle = titleFieldName
        ? project.subject[titleFieldName]
        : project.subject.titleEn;

      const difficultyTitle = titleFieldName
        ? project.difficulty[titleFieldName]
        : project.difficulty.titleEn;

      return {
        _id: project._id,
        titleUz: project.titleUz,
        titleRu: project.titleRu,
        titleEn: project.titleEn,
        title: titleFieldName ? project[titleFieldName] : project.titleEn,
        descriptionUz: project.descriptionUz,
        descriptionRu: project.descriptionRu,
        descriptionEn: project.descriptionEn,
        description: descriptionFieldName
          ? project[descriptionFieldName]
          : project.descriptionEn,
        point: project.point,
        pointForPereviwer: project.pointForPereviwer,
        tutorials: project.tutorials,
        subject: {
          _id: project.subject._id,
          title: subjectTitle,
        },
        difficulty: {
          _id: project.difficulty._id,
          title: difficultyTitle,
        },
      };
    });
    return res.status(200).json({ data: result.reverse() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.searchProjects = async (req, res) => {
  try {
    const { search, lang } = req.query;
    const decodedSearch = decodeURIComponent(search);
    const regex = new RegExp(decodedSearch, "i");
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
    const projects = await Project.find({
      $or: [
        { titleUz: { $regex: regex } },
        { descriptionUz: { $regex: regex } },
        { titleRu: { $regex: regex } },
        { descriptionRu: { $regex: regex } },
        { titleEn: { $regex: regex } },
        { descriptionEn: { $regex: regex } },
      ],
    })
      .populate("subject")
      .populate("difficulty");
    const result = projects.map((project) => {
      const subjectTitle = titleFieldName
        ? project.subject[titleFieldName]
        : project.subject.titleEn;
      const difficultyTitle = titleFieldName
        ? project.difficulty[titleFieldName]
        : project.difficulty.titleEn;
      return {
        _id: project._id,
        titleUz: project.titleUz,
        titleRu: project.titleRu,
        titleEn: project.titleEn,
        title: titleFieldName ? project[titleFieldName] : project.titleEn,
        descriptionUz: project.descriptionUz,
        descriptionRu: project.descriptionRu,
        descriptionEn: project.descriptionEn,
        description: descriptionFieldName
          ? project[descriptionFieldName]
          : project.descriptionEn,
        point: project.point,
        pointForPereviwer: project.pointForPereviwer,
        tutorials: project.tutorials,
        subject: {
          _id: project.subject._id,
          title: subjectTitle,
        },
        difficulty: {
          _id: project.difficulty._id,
          title: difficultyTitle,
        },
      };
    });
    return res.status(200).json({ data: result });
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
