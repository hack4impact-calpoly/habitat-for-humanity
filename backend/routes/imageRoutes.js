const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer"); // multer will be used to handle the form data.
const Aws = require("aws-sdk"); // aws-sdk library will used to upload image to s3 bucket.
Aws.config.update({ region: "us-west-1" });
const Image = require("../models/imageSchema.js"); // our product model.
require("dotenv/config"); // for using the environment variables that store the confidential information.

// creating the storage variable to upload the file and providing the destination folder,
// if nothing is provided in the callback, it will get uploaded in the main directory

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "");
  },
});

// below variable is defined to check the type of file being uploaded

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// defining the upload variable for the configuration of the photo being uploaded
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Now creating the S3 instance, which will be used in uploading photos to the s3 bucket.
const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // accessKeyId that is stored in .env file
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET, // secretAccessKey is also stored in .env file
});

console.log("Connected to S3 bucket 'habitat-photos-storage-2025'");

// now handling the post request to upload photos
router.post("/", upload.single("productImage"), async (req, res) => {
  console.log("This is the file %s", req.file); // to check the data in the console that is being uploaded

  const params = {
    Bucket: String(process.env.AWS_BUCKET_NAME),
    Key: String(req?.file?.originalname), // Name of the image
    Body: req?.file?.buffer, // Body which will contain the image in buffer format
    ContentType: "image/jpeg", // Necessary to define the image content-type to view the photo in the browser with the link
  };

  console.log(params);

  // uploading the photo using the s3 instance and saving the key in the database.
  s3.upload(params, async (error, data) => {
    if (error) {
      res.status(500).send({ err: error }); // if we get any error while uploading, error message will be returned.
    }
    console.log("Data:", data);

    // If not, then the below code will be executed
    let name = req.body.name || req.file.originalname;
    const { ETag, Bucket, Key } = data;
    const Location =
      data.Location || `https://${Bucket}.s3.amazonaws.com/${Key}`;

    let newImage = new Image({
      _id: mongoose.Types.ObjectId(),
      key: Key,
      name: name,
      link: Location,
    });

    try {
      await newImage.save();
      res.send(newImage);
    } catch (error) {
      res.status(400).send(error);
    }
  });
});

// Get all the product data from db
router.get("/", async (req, res) => {
  try {
    console.log("Processing GET request");
    const bucketParams = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
    };

    s3.listObjects(bucketParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
        res.send(data.Contents);
      }
    });
  } catch (err) {
    res.send({ message: err, m: "not working" });
  }
});

const getFileStream = (fileKey) => {
  const downloadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
  };
  return s3.getObject(downloadParams).createReadStream();
}

// Get image by id from AWS S3 bucket
router.get("/:imageId", async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.imageId });

    if (!image) {
      return res.status(404).send({ error: "Image not found in the database" });
    }

    // Set the appropriate content type based on the image file extension
    const contentType = getContentType(image.key);
    res.setHeader('Content-Type', contentType);
    
    // Create and pipe the stream
    const readStream = getFileStream(image.key);
    readStream.pipe(res);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: image.key,
    };

    s3.getObject(params, (error, data) => {
      if (error) {
        console.error("S3 Error:", error);
        return res.status(500).send({ error: "Failed to fetch image from S3" });
      }

      const readStream = getFileStream(image.key);
      res.setHeader("Content-Type", "image/jpeg");
      readStream.pipe(res);
      readStream.on("error", (error) => {
        console.error("Error fetching image from s3", error);
        res.status(500).send({ error: "Failed to fetch image from S3" });
      });
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route for getting a presigned URL
router.get("/presigned-url/:filename", async (req, res) => {
  console.log("Processing GET request");
  try {
    const { filename } = req.params;
    console.log('Getting presigned URL for image with filename "%s"', filename);

    // check if image exists in the S3 bucket
    const params = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: String(filename),
    };

    console.log("Looking for param: ", params);
    await s3.headObject(params).promise();

    console.log("Image exists in S3 bucket");

    // get presigned URL for image
    const url = s3.getSignedUrl("getObject", params);

    res.send({ url: url });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Delete an image by filename
router.delete("/:filename", async (req, res) => {
  console.log("Processing DELETE request");
  try {
    const { filename } = req.params;
    console.log('Deleting image with filename "%s"', filename);

    // check if image exists in the S3 bucket
    const params = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: String(filename),
    };

    console.log("Looking for param: ", params);
    await s3.headObject(params).promise();

    console.log("Image exists in S3 bucket");

    // delete image from S3 bucket
    await s3.deleteObject(params).promise();

    // delete image from MongoDB
    await Image.deleteOne({ key: filename });

    res.send({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
