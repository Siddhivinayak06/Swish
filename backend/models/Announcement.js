const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const VALID_CATEGORIES = ['Examination', 'Cultural', 'Technical Clubs', 'Scholarship'];

class Announcement {
    static collection() {
        return getDB().collection('announcements');
    }

    static async create(data) {
        const category = VALID_CATEGORIES.includes(data.category) ? data.category : 'Examination';

        const doc = {
            subject: data.subject,
            description: data.description,
            priority: data.priority || 'Medium',
            category,
            photo: data.photo || null,
            createdBy: data.createdBy ? new ObjectId(data.createdBy) : null,
            createdAt: new Date()
        };

        const result = await this.collection().insertOne(doc);
        if (result.insertedId) {
            return await this.collection().findOne({ _id: result.insertedId });
        }
        return null;
    }

    static async getAll({ category = null, limit = 50 } = {}) {
        const q = {};
        if (category && VALID_CATEGORIES.includes(category)) q.category = category;

        return await this.collection().find(q).sort({ createdAt: -1 }).limit(limit).toArray();
    }
}

module.exports = Announcement;

