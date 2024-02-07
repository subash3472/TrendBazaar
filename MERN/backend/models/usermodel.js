const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    maxlength: [6, "Password cannot exceed 6 characters"],
    select: false,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// before . passwords are im directly saved on db , it maycause issues like hacking ,
// to prevant need to hash => (bcrypt pakage im using)

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
});

// here . i need to know wheather the user are in , to check that
// jsonwebtoken
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
// checking password  or comparing
userSchema.methods.isValidpassword = async function (enteredpassword) {
  return bcrypt.compare(enteredpassword, this.password);
};
// reset password
userSchema.methods.getResetToken = function () {
  // generate token
  const token = crypto.randomBytes(20).toString("hex");
  //  generate hash and set to reset password token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // set token  exp time,
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};
let model = mongoose.model("User", userSchema);

module.exports = model;
