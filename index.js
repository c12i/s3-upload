const express = require("express");
const AWS = require("aws-sdk");
const { v4 } = require("uuid");

const { MIME_TYPES, uploadMiddleware } = require("./middleware/multer-config");

// load env variables
require("dotenv/config");
const { AWS_ID, AWS_SECRET, AWS_BUCKET_NAME } = process.env;

const app = express();
const PORT = 8080;

// instantiate S3
const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
});

app.post("/upload", uploadMiddleware, (req, res) => {
  // add filename property to req.file object
  req.file["filename"] = `${v4()}.${MIME_TYPES[req.file.mimetype]}`;

  // s3.upload options
  const options = {
    Bucket: AWS_BUCKET_NAME,
    Key: req.file.filename,
    Body: req.file.buffer,
  };

  try {
    // upload to s3 bucket
    s3.upload(options, (error, data) => {
      if (error) {
        console.error(error);
        throw error.toString();
      }
      // data.Location => filepath on s3
      res.status(200).send(data);
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
