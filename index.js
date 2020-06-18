const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4 } = require("uuid");

// load env variables
require("dotenv/config");
const { AWS_ID, AWS_SECRET, AWS_BUCKET_NAME } = process.env;

const app = express();
const PORT = 8080;

// multer config
const MIME_TYPES = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extention = MIME_TYPES[file.mimetype];
    cb(null, `${name}${v4()}.${extention}`);
  },
});

// middleware
const uploadMiddleware = multer({ storage }).single("image");

// instantiate S3
const s3 = new AWS.S3({
    accessKeyId: AWS_ID,
    secretAccessKey: AWS_SECRET,
});

app.post("/upload", uploadMiddleware, (req, res) => {
  console.log(req.file.filename);
  res.send("HELLO");
});

app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
