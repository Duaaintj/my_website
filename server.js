const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Database Connection
const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_CONNECTION_STRING_HERE';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 2. Article Schema & Model Definition
const postSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// 3. User Registration Route
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  res.json({ message: "Registration successful" });
});

// 4. Create and Publish Article Route
app.post('/api/posts', async (req, res) => {
  try {
    const { author, title, content } = req.body;

    const newPost = new Post({ author, title, content });
    await newPost.save();

    res.status(201).json({ message: "Article published successfully!", post: newPost });
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ error: "Failed to publish article" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
