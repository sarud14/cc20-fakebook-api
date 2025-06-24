export default (err, req, res, next) => {
  console.log(err);
  err.statusCode = 500;
  res.status(err.statusCode).json({
    errorName: err.name,
    error: err.message,
  });
};
