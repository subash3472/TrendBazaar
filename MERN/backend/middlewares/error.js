// this middleware page is used for in fetching if may any error happened thats identified on
// errorhandle page , need to send error only after that need to disapear , so im creating this

const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV == "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  if (process.env.NODE_ENV == "production") {
    let message = err.message;
    // let error = { ...err };
    let error = new Error(message);
    // let error = new ErrorHandler(message, err.statusCode);

    if (err.name == "ValidatorError") {
      message = Object.values(err.errors).map((value) => value.message);
      // error = new ErrorHandler(message, 400);
      error = new ErrorHandler(message);
    }
    //  for db casterror
    if (err.name == "CastError") {
      message = `Resource not found ${err.path}`;
      // error = new error(message);
      error = new Error(message);
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};
