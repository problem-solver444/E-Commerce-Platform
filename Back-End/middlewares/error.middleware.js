const ApiError = require('../utils/api-error');

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return developmentError(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleExpiredJwt();

    return productionError(err, res);
  }

  return productionError(err, res);
};

const handleJwtInvalidSignature = () =>
  new ApiError('Invalid token, please login again.', 401);

const handleExpiredJwt = () => new ApiError('Token expired, please login again.', 401);

const developmentError = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const productionError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    status,
    message,
  });
};

module.exports = globalError;
