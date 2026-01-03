const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Images Only!'));
        }
    }
});

// Routes
router.post('/', protect, adminOnly, upload.single('photo'), createAnnouncement);
router.get('/', protect, getAnnouncements);

module.exports = router;
