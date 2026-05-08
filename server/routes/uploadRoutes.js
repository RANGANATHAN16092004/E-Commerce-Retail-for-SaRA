const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, admin, (req, res, next) => {


  console.log('--- Upload Start ---');
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error Details:', err);
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      console.error('Cloudinary/General Error Details:', err);
      return res.status(500).json({ message: `Upload error: ${err.message}` });
    }
    
    console.log('File processed by Multer:', req.file ? 'YES' : 'NO');
    
    if (req.file) {
      console.log('Uploaded File Path:', req.file.path);
      res.json({ url: req.file.path });
    } else {
      console.warn('No file in request');
      res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('--- Upload End ---');
  });
});



module.exports = router;
