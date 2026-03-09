import path from 'path';
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'sakhi-scents',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max per file
    fileFilter: (_req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
    },
});

// POST /api/upload — single image
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({
        message: 'Image uploaded',
        image: req.file.path, // Cloudinary secure URL
    });
});

// POST /api/upload/multiple — up to 5 images
router.post('/multiple', upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const urls = req.files.map((f) => f.path);
    res.json({
        message: `${urls.length} image(s) uploaded`,
        images: urls,
    });
});

export default router;
