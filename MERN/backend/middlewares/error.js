// this middleware page is used for in fetching if may any error happened thats identified on
// errorhandle page , need to send error only after that need to disapear , so im creating this

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
    let error = new Error(message);

    // if (err.name == "ValidatorError") {
    if (err.name == "ValidatonError") {
      message = Object.values(err.errors).map((value) => value.message);
      // error = new ErrorHandler(message);
      error = new Error(message);
      err.statusCode = 400;
    }
    //  for db casterror
    if (err.name == "CastError") {
      message = `Resource not found ${err.path}`;
      // error = new error(message);
      error = new Error(message);
      err.statusCode = 400;
    }

    // same email error
    if (err.code == 11000) {
      let message = `Duplicate ${Object.keys(err.keyValue)} error`;
      error = new Error(message);
      err.statusCode = 400;
    }

    res.status(err.statusCode).json({
      success: false,
      // message: err.message || "Internal Server Error",
      message: error.message || "Internal Server Error",
    });
  }
};
