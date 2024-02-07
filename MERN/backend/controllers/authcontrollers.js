// this page is used to authentication  for user

const catchasyncerror = require("../middlewares/catchasyncerror");
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

// adding logout function
exports.logoutuser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logout",
    });
};

// forgot password
// exports.forgotpassword = catchAsyncError(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new ErrorHandler("Uer not found with this email", 404));
//   }

//   const resetToken = user.getResetToken();
//   user.save({ validateBeforeSave: false });

//   //create reset url
//   // BASE_URL = http://127.0.0.1/api/v1/password/reset/{token}

//   const resetUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/password/reset/${resetToken}`;

//   const messege = `your password reset url is as follows /n/n'
//   ${resetUrl} /n/n if you have not requested this email,then ignore isTaxID. `;

//   try {
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordTokenExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(new ErrorHandler(error.message), 500);
//   }
// });

// get user profile
// {{base_url}}/api/v1/myprofile
exports.getUsersprofile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// change password
// {{base_url}}/api/v1/password/change

exports.changepassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // check old password
  if (!(await user.isValidpassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }

  // assigning new password
  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    success: true,
  });
});

// update profile
// {{base_url}}/api/v1/update

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});
// ............................................................................................................

// Admin: get all Users
// {{base_url}}/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Admin:get specific Users
// {{base_url}}/api/v1/admin/user/:id

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`user not found in this id ${user}`));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin: Update user
// {{base_url}}/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin: delete user
// {{base_url}}/api/v1/admin/user/:id

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`user not found in this id ${user}`));
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
