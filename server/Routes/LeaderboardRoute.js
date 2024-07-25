const { leaderboard } = require("../Controllers/LeaderboardController");
const router = require("express").Router();

router.get("/", leaderboard);

module.exports = router;