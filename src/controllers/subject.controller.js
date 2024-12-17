const Subject = require("../models/Subject.js");
const Teacher = require("../models/Teacher.js");

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

exports.getAllSubjects = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({ message: "Invalid language request" });
    }
    const subjects = await Subject.find();
    const result = subjects.map((subject) => {
      return {
        _id: subject._id,
        titleUz: subject.titleUz,
        titleRu: subject.titleRu,
        titleEn: subject.titleEn,
        title: fieldName ? subject[fieldName] : undefined,
      };
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const { lang } = req.query;
    const fieldName = getLanguageField(lang);
    if (lang && !fieldName) {
      return res.status(400).json({ message: "Invalid language request" });
    }
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    const result = {
      _id: subject._id,
      titleUz: subject.titleUz,
      titleRu: subject.titleRu,
      titleEn: subject.titleEn,
      title: fieldName ? subject[fieldName] : undefined,
    };
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllSubjectsByTeacher = async (req, res) => {
  try {
    const teacherId = req.teacher.id;
    const teacher = await Teacher.findById(teacherId).populate("subject");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const { lang } = req.query;
    const subjects = teacher.subject;
    const result = subjects.map((subject) => {
      const titleField =
        lang === "uz"
          ? subject.titleUz
          : lang === "ru"
          ? subject.titleRu
          : lang === "en"
          ? subject.titleEn
          : subject.titleEn;
      return {
        _id: subject._id,
        title: titleField,
      };
    });
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const { titleUz, titleRu, titleEn } = req.body;
    if (!titleUz || !titleRu || !titleEn) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const subject = await Subject.create({ ...req.body });
    return res.status(201).json({ data: subject });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    return res.status(200).json({ data: subject });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    return res.json({ data: subject });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
