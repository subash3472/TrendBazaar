// this function is used as if got any required errors like (name : required)
// that required field is empty end with app crash to solve we need to give (catch) , to continue (next)

module.exports = (func) => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};
