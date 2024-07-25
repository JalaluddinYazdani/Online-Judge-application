const {
    register,
    login,
    logout,
    verifyWithOTP,
    forgotPassword,
    updatePassword,
  } = require("../Controllers/AuthController");
  const { userVerification } = require("../Middlewares/AuthMiddleware.js");
  const router = require("express").Router();
  
  router.post("/register", register);
  router.post("/verify/:id", verifyWithOTP);
  router.get("/forgotpassword/:email", forgotPassword);
  router.post("/updatepassword/:id", updatePassword);
  router.post("/login", login);
  router.post("/logout", logout);
  router.post("/", userVerification);
  
  module.exports = router;