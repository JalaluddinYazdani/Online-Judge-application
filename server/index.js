const express = require("express");
const { DBConnection } = require("./Database/db.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const AuthRoute = require("./Routes/AuthRoute");
const ProblemRoute = require("./Routes/ProblemRoute.js");
const AdminRoute = require("./Routes/AdminRoute.js");
const LeaderboardRoute = require("./Routes/LeaderboardRoute.js");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL=process.env.FRONTEND_URL || "http://localhost:5173";

const corsOptions = {
  origin: [FRONTEND_URL,"http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

DBConnection();

app.use("/", AuthRoute);
app.use("/problems", ProblemRoute);
app.use("/admin", AdminRoute);
app.use("/leaderboard", LeaderboardRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});