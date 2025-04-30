const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/twitter-clone')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Twitter Clone API' });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 