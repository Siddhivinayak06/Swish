const Announcement = require('../models/Announcement');

// Create announcement (admin only)
const createAnnouncement = async (req, res) => {
    try {
        const { priority, subject, description, category } = req.body;
        let photoPath = null;
        if (req.file) {
            photoPath = `/uploads/${req.file.filename}`;
        }

        const announcement = await Announcement.create({
            priority,
            subject,
            description,
            category,
            photo: photoPath,
            createdBy: req.user ? req.user._id : null
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const category = req.query.category || null;
        const items = await Announcement.getAll({ category, limit: 100 });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createAnnouncement, getAnnouncements };
