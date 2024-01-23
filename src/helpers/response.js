const response = (response, statusCode, message, data = undefined) => {
  response.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};

module.exports = response;
