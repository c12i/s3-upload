const multer = require("multer");

exports.MIME_TYPES = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
  "application/zip": "zip",
};

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
});

exports.uploadMiddleware = multer({ storage }).single("file");
