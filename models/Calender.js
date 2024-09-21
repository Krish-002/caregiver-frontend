const express = require('express');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create Event
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, date } = req.body;
    try {
        const event = new Event({ user: req.user.id, title, description, date });
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get User Events
router.get('/', authMiddleware, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id });
        res.json(events);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;