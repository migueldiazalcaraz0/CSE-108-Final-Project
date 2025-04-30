const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-here');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

// Create a tweet
router.post('/', auth, async (req, res) => {
    try {
        const tweet = new Tweet({
            ...req.body,
            user: req.userId
        });
        await tweet.save();
        res.status(201).json(tweet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all tweets
router.get('/', async (req, res) => {
    try {
        const tweets = await Tweet.find().sort({ createdAt: -1 });
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get tweets by user
router.get('/user/:userId', async (req, res) => {
    try {
        const tweets = await Tweet.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(tweets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a tweet
router.delete('/:id', auth, async (req, res) => {
    try {
        const tweet = await Tweet.findOne({ _id: req.params.id, user: req.userId });
        if (!tweet) {
            return res.status(404).json({ message: 'Tweet not found' });
        }
        await tweet.deleteOne();
        res.json({ message: 'Tweet deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 