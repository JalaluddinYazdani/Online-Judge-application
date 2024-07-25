const User = require("../Model/User.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "User authentication failed",
      });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, data) => {
      if (error) {
        return res
          .status(404)
          .json({ success: false, message: "User authentication failed" });
      } else {
        const user = await User.findById(data.id);
        if (user) {
          user.password = undefined;
          return res.status(200).json({ success: true, user });
        } else
          return res
            .status(404)
            .json({ success: false, message: "User authentication failed" });
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};