/**
 * Sprint 10 Track B - Global Centralized Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  console.error("❌ Application Error:", err);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: "Mongoose Validation Error",
      details: messages
    });
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid resource identifier format: '${err.value}'`
    });
  }

  // Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `Duplicate value entered for '${field}'. Must be unique.`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
