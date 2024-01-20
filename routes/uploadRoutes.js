// routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    return cb(null,`${file.originalname}`)
  }
})


const upload = multer({ storage: storage })

const Photo = mongoose.model('imgurl', new mongoose.Schema({
  filename: String,
  data: Buffer, // Binary data for the image
}));

// Route for rendering the form to upload an image
router.get('/', (req, res) => {
  res.render('uploadForm'); // Create an 'uploadForm' view with a form for image upload
});

router.get('/image',(req,res)=>{
  res.render("image")
})

// Route for handling image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    
    const photo = new Photo({
      filename: `${req.file.originalname}`,
      data: req.file.buffer,


    });
    console.log(req.file);
    await photo.save();
    res.redirect('/upload'); // Redirect to the upload form or another route
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});


// Generate a random hash
function generateRandomHash() {
  const randomBytes = crypto.randomBytes(16);
  const hash = crypto.createHash('md5').update(randomBytes).digest('hex');
  return hash;
}

module.exports = router;
