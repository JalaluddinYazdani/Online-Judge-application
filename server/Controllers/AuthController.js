const User = require("../Model/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SendEmail = require("../utils/SendEmail.js");
const OtpGenerate = require("../utils/OtpGenerate.js");

module.exports.register = async (req, res, next) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;

    if (!(firstname && lastname && phone && email && password)) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter all the informations" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(404)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const existsUser = await User.create({
      firstname,
      lastname,
      phone,
      email,
      password: hashedPass,
    });

    // const otp = await OtpGenerate();
    // const hashedOtp = await bcrypt.hash(otp, 10);
    // existsUser.otp = hashedOtp;
    // await existsUser.save();
    // await SendEmail(existsUser.email, "Verify User with OTP", otp);
    // res.status(200).json({
    //   message:
    //     "Successfully registered !! An Otp Sent to you on your Email for Verification",
    //   success: true,
    //   id: existsUser._id,
    // });

    const token = jwt.sign({ id: existsUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
   
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      withCredentials: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("token", token, options);
    res.status(200).json({
      message: "Successfully Registered",
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

    const existsUser = await User.findOne({ email });
    if (!existsUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't get Registered. Please Register first",
      });
    }

    const enteredPass = await bcrypt.compare(password, existsUser.password);
    if (!enteredPass) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid login credentials" });
    }
    // if (!existsUser.verified) {
    //   const otp = await OtpGenerate();
    //   await SendEmail(existsUser.email, "Verify User with OTP", otp);
    //   const hashedOtp = await bcrypt.hash(otp, 10);
    //   existsUser.otp = hashedOtp;
    //   await existsUser.save();
    //   return res.status(201).json({
    //     success: true,
    //     message: "A OTP has sent to your email to get it verified",
    //     id: existsUser._id,
    //   });
    // }
    const token = jwt.sign({ id: existsUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      withCredentials: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("token", token, options);
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
    res.clearCookie("token", {
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({ success: true, message: "Successfully Logout" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.verifyWithOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    const { otp } = req.body;
    if (!otp) {
      return res.status(404).json({ success: false, message: "OTP not found" });
    }
    const validOtp = await bcrypt.compare(otp, user.otp);
    if (validOtp) {
      user.otp = null;
      user.verified = true;
      await user.save();
      res.status(200).json({
        success: true,
        message: "OTP verification successfull. You can login now",
      });
      next();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "OTP not matches" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Enter Registered Email" });
    }
    const otp = await OtpGenerate();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await SendEmail(user.email, "OTP for forgot password", otp);
    user.verified = false;
    user.otp = hashedOtp;
    await user.save();
    res.status(200).json({
      message: "An Otp Sent to you on your Email for Verification",
      success: true,
      id: user._id,
    });
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    const { password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    if (user.verified) {
      user.password = hashedPass;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password Updated successfully. You can login Now",
      });
      next();
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Please verify with otp first" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};