/**
 * Sprint 10 Track B - Request Logger Middleware
 * Intercepts incoming requests and logs:
 * [METHOD] /url-path - HH:MM:SS AM/PM (Duration in ms)
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

  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${method}] ${url} [${res.statusCode}] - ${formattedTime} (${duration}ms)`);
  });

  next();
}

module.exports = requestLogger;
