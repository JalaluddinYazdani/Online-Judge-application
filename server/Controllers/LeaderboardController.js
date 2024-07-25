const User = require("../Model/User.js");
module.exports.leaderboard = async (req, res, next) => {
  try {
    const results = await User.aggregate([
      {
        $unwind: "$submissions",
      },
      {
        $group: {
          _id: "$_id",
          firstname: { $first: "$firstname" },
          lastname: { $first: "$lastname" },
          problemsSolved: { $addToSet: "$submissions.problemId" }
        }
      },
      {
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          totalProblemsSolved: { $size: "$problemsSolved" }
        }
      },
      {
        $sort: {
          totalProblemsSolved: -1,
        },
      },
    ]).exec();

    res.status(200).json({ success: true, results });
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};