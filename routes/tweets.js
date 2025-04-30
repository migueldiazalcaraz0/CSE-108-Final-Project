const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const auth = require('../middleware/auth');

// Get all tweets
router.get('/', async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 });
    res.json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create tweet
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const tweet = new Tweet({
      content,
      user: req.user.id
    });
    await tweet.save();
    res.json(tweet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tweet
router.delete('/:id', auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }
    if (tweet.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await tweet.remove();
    res.json({ message: 'Tweet removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 