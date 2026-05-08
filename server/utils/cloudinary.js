const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.toLowerCase(),
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


console.log('Cloudinary Configured:', process.env.CLOUDINARY_CLOUD_NAME);

const storage = new CloudinaryStorage({

  cloudinary: cloudinary,
  params: {
    folder: 'stylenest_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

module.exports = { cloudinary, storage };
