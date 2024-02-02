// this page is used to autenticate the user before login by using cookies

const ErrorHandler = require("../utils/errorhandler");
const catchasyncerror = require("./catchasyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

exports.isAutenticateduser = catchasyncerror(async (req, res, next) => {
  const { token } = req.cookies;
  //   checking here user logined or not
  if (!token) {
    return next(new ErrorHandler("Login first to handle this resorce", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});
