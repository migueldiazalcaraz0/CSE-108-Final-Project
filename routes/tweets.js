const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const auth = require('../middleware/auth');

// Get all tweets
router.get('/', async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name username');
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
      user: req.user.userId
    });
    await tweet.save();
    
    // Populate user data before sending response
    await tweet.populate('user', 'name username');
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
    if (tweet.user.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await tweet.deleteOne();
    res.json({ message: 'Tweet removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 