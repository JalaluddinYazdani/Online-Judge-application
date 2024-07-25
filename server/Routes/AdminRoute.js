const { register, login, logout } = require("../Controllers/AdminController");
const { adminVerification } = require("../Middlewares/AdminVerification");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/", adminVerification);
module.exports = router;