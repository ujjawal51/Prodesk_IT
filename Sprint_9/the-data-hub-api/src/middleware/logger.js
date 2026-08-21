/**
 * Custom Request Logger Middleware (Sprint 09 Track B requirement)
 * Intercepts every incoming request and logs:
 * [METHOD] /url-path - HH:MM:SS AM/PM
 * Example: [GET] /posts - 10:05:12 AM
 */
function requestLogger(req, res, next) {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const now = new Date();
  
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  console.log(`[${method}] ${url} - ${formattedTime}`);
  
  // Track execution time
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    // Optional detailed response log
    // console.log(`  └─> [${statusCode}] completed in ${duration}ms`);
  });

  next();
}

module.exports = requestLogger;
