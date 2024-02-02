// this page is used to authentication  for user

const catchAsyncError = require("../middlewares/catchasyncerror");
const User = require("../models/usermodel");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  res.status(201).json({
    success: true,
    user,
  });
});
