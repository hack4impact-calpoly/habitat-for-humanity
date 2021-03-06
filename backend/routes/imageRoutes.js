const mongoose = require('mongoose')
const express = require('express')
const fs = require('fs')
const router = express.Router()               
const multer = require('multer')              // multer will be used to handle the form data.
const Aws = require('aws-sdk');                // aws-sdk library will used to upload image to s3 bucket.
Aws.config.update({region: 'us-west-1'});
const Image = require('../models/imageSchema.js')  // our product model.

// const fileSchema = require('../models/fileSchema.ts')  // our product model.
require("dotenv/config")                      // for using the environment variables that stores the confedential information.

// creating the storage variable to upload the file and providing the destination folder, 
// if nothing is provided in the callback it will get uploaded in main directory

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
      cb(null, '')
  }
})

// below variable is define to check the type of file which is uploaded

const filefilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

// defining the upload variable for the configuration of photo being uploaded
const upload = multer({ storage: storage, fileFilter: filefilter });

// Now creating the S3 instance which will be used in uploading photo to s3 bucket.
const s3 = new Aws.S3({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,              // accessKeyId that is stored in .env file
  secretAccessKey:process.env.AWS_ACCESS_KEY_SECRET       // secretAccessKey is also store in .env file
})

console.log('Connected to S3 bucket \'habitat-photo-bucket\'')

// now how to handle the post request and to upload photo (upload photo using the key defined below in upload.single ie: productimage )
router.post('/', upload.single('productImage'), async (req, res) => {
    console.log('This is the file %s', req.file)  // to check the data in the console that is being uploaded

    const params = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: String(req?.file?.originalname),               // Name of the image
      Body: req?.file?.buffer,                    // Body which will contain the image in buffer format
      ContentType:"image/jpeg"                 // Necessary to define the image content-type to view the photo in the browser with the link
    };

    // uploading the photo using s3 instance and saving the key in the database.
    s3.upload(params, async (error, data) => {
      if(error) {
          res.status(500).send({"err":error})  // if we get any error while uploading error message will be returned.
      }

      // If not then below code will be executed
      let name = req.body.name;
      const { Location, ETag, Bucket, Key } = data;

      let newImage = new Image({
        _id: mongoose.Types.ObjectId(),
        key: Key,
        name: name,
        link: Location
      });
      try {
        await newImage.save()
        res.send(newImage)
      } catch (error) {
        res.status(400).send(error);
      }
      
    })
})

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: String(process.env.AWS_BUCKET_NAME)
  }

  return s3.getObject(downloadParams).createReadStream()
}

// Get all the product data from db 
router.get('/', async (req, res) => {
  try {
      console.log("Processing GET request")
      const bucketParams = {
        Bucket: String(process.env.AWS_BUCKET_NAME),
      }

      s3.listObjects(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
          res.send(data.Contents)
        }
      });
      
  } catch (err) {
      res.send({ message: err, m:"not working" })
  }
})

//get image by key
router.get("/:imageId", async (req, res) => {
  try {

    const image = await Image.findOne({ _id: req.params.imageId})

    console.log(image)
    const readStream = getFileStream(image.key)
  
    readStream.pipe(res)
    // s3.getObject()
    // const item = await Item.findOne({ _id: req.params.itemId})
    // res.send(item)
    // console.log('Got item with id %s', req.params.itemId)
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = router
