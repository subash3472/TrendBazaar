// this page is used to authentication  for user

const catchAsyncError = require("../middlewares/catchasyncerror");
const User = require("../models/usermodel");
const ErrorHandler = require("../utils/errorhandler");
const sendToken = require("../utils/jwt");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  sendToken(user, 201, res);

  // or

  //     const token = user.getJwtToken();
  //     res.status(201).json({
  //     success: true,
  //     user,
  //     token,
  //        });
});
// allowing login for user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  // finding the user from database
  const user = await User.findOne({ email }).select("+password");
  if (!user || !password) {
    return next(new ErrorHandler("Enter valid email or  password", 401));
  }
  // comparing password client & db
  if (!(await user.isValidpassword(password))) {
    return next(new ErrorHandler("Invalid email or  password", 401));
  }
  // here both username and password crt , further i need to send responce

  sendToken(user, 201, res);
});
