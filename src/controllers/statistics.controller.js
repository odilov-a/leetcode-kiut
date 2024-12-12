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
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);
    return res.status(200).json({ data: languageCounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
