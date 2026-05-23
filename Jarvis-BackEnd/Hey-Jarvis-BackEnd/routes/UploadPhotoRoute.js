import express from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../utils/cloudinary.js'; // assuming this is properly configured

const UploadPhoto = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

UploadPhoto.post('/upload', upload.single("VerficationPhoto"), async (req, res) => {
  console.log('Hey we are inside the Upload Photo Route');
  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    console.log('Uploaded Image URL:', result.secure_url);
    return res.json({ message: 'Message Uploaded Successfully', Url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default UploadPhoto;
