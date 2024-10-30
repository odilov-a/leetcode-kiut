const Attempt = require("../models/Attempt.js");

exports.languageDistribution = async (req, res) => {
  try {
    const languageCounts = await Attempt.aggregate([
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    return res.status(200).json({ data: languageCounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.submissionAccuracyByLanguage = async (req, res) => {
  try {
    const accuracyData = await Attempt.aggregate([
      {
        $group: {
          _id: { language: "$language", isCorrect: "$isCorrect" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.language",
          results: {
            $push: {
              isCorrect: "$_id.isCorrect",
              count: "$count",
            },
          },
        },
      },
    ]);
    const formattedData = accuracyData.map((item) => {
      const correctCount = item.results.find((r) => r.isCorrect)?.count || 0;
      const incorrectCount = item.results.find((r) => !r.isCorrect)?.count || 0;
      return {
        language: item._id,
        correct: correctCount,
        incorrect: incorrectCount,
      };
    });
    return res.status(200).json({ data: formattedData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.averageAccuracyPerLanguage = async (req, res) => {
  try {
    const accuracyData = await Attempt.aggregate([
      {
        $group: {
          _id: "$language",
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          language: "$_id",
          accuracy: { $multiply: [{ $divide: ["$correct", "$total"] }, 100] },
        },
      },
      {
        $sort: { accuracy: -1 },
      },
    ]);
    return res.status(200).json({ data: accuracyData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
