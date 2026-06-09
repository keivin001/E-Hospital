export const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const response = {
    message: err.message || 'Internal server error',
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(status).json(response);
};
