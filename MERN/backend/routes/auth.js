// this file is giving routes for users

const express = require("express");
const { registerUser } = require("../controllers/authcontrollers");
const router = express.Router();

router.route("/register").post(registerUser);

module.exports = router;
