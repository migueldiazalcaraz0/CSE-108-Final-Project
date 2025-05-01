const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const tweetRoutes = require('./routes/tweets');

// Load environment variables
dotenv.config();

const app = express();

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://daizmiguel76:Miguel@cluster0.7nmuvoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  console.log('MongoDB URI:', MONGODB_URI);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('MongoDB URI:', MONGODB_URI);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tweets', tweetRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  console.log('Serving index.html for path:', req.path);
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Current directory:', __dirname);
  console.log('Static files directory:', path.join(__dirname, '..'));
  console.log('Available routes:');
  console.log('- /api/auth/*');
  console.log('- /api/tweets/*');
  console.log('- /api/test');
}); 