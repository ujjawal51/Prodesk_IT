const multer = require('multer');

// Store uploaded file buffer in memory so it can be streamed directly to Cloudinary CDN
const storage = multer.memoryStorage();

// File filter to restrict uploads to valid image formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: JPG, PNG, WEBP, GIF.`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB maximum file size limit
  }
});

module.exports = upload;
