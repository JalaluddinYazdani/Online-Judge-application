const Admin = require("../Model/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { fullName, phone, email, password } = req.body;
    if (!(fullName && phone && email && password)) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter all the informations" });
    }
    const admin = await Admin.find({});
    if (admin.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One Admin is already there, only one admin get registered",
      });
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const existsAdmin = await Admin.create({
      fullName,
      phone,
      email,
      password: hashedPass,
    });

    const token = jwt.sign({ id: existsAdmin._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    existsAdmin.token = token;
    existsAdmin.password = undefined;
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "None",
    };

    res.cookie("adminToken", token, options);
    res.status(200).json({
      message: "Successfully registered !!",
      success: true,
    });
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(404).json({
        success: false,
        message: "All the Information are required to get login",
      });
    }

    const existsAdmin = await Admin.findOne({ email });
    if (!existsAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin doesn't get Registered",
      });
    }

    const enteredPass = await bcrypt.compare(password, existsAdmin.password);
    if (!enteredPass) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid login credentials" });
    }

    const token = jwt.sign({ id: existsAdmin._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      withCredentials: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("adminToken", token, options);
    res.status(200).json({
      message: "Successfully Logged in!!",
      success: true,
    });
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("adminToken", {
      secure: true,
      sameSite: "None",
    });
    res
      .status(200)
      .json({ success: true, message: "Admin Successfully Logout" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};