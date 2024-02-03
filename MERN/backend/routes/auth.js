// this file is giving routes for users

const express = require("express");
const { registerUser, loginUser } = require("../controllers/authcontrollers");
const ErrorHandler = require("../utils/errorhandler");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
