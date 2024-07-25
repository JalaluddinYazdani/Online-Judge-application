const Admin = require("../Model/Admin.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.adminVerification = (req, res) => {
  try {
    const adminToken = req.cookies.adminToken;
    if (!adminToken) {
      return res.status(404).json({
        success: false,
        message: "Admin authentication failed",
      });
    }
    jwt.verify(adminToken, process.env.SECRET_KEY, async (error, data) => {
      if (error) {
        return res
          .status(404)
          .json({ success: false, message: "Admin authentication failed" });
      } else {
        const admin = await Admin.findById(data.id);
        if (admin) {
          return res.status(200).json({ success: true, admin: admin.fullName });
        } else
          return res
            .status(404)
            .json({ success: false, message: "Admin authentication failed" });
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};