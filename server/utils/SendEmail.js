const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
module.exports = async (email, subject, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: process.env.HOST,
      service: process.env.SERVICE,
      // port: process.env.EMAIL_PORT,
      // secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text:
        "Your verification otp is " + otp + " Please don't share with anyone.",
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent!");
    console.log(error);
    return error;
  }
};