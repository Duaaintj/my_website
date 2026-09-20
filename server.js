const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Database Connection
const MONGO_URI = process.env.MONGO_URI || 'YOUR_ACTUAL_MONGODB_CONNECTION_STRING_HERE';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 2. Article Schema & Model Definition
const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// 3. User Registration Route
app.post('/api/register', (req, res) => {
  res.json({ message: "Registration successful" });
});

// 4. Create and Publish Article Route
app.post('/api/posts', async (req, res) => {
  try {
    const { author, title, content } = req.body;

    if (!author || !title || !content) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة." });
    }

    const newPost = new Post({ author, title, content });
    await newPost.save();

    res.status(201).json({ message: "Article published successfully!", post: newPost });
  } catch (error) {
    console.error("Error saving post to DB:", error.message);
    res.status(500).json({ error: "Failed to publish article", details: error.message });
  }
});
// 5. Get All Published Articles Route
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// 6. Get Single Article Details Route
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// 1. Authentication Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Please log in to publish a post.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = verified;
    next(); 
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// 2. Protected Post Creation Route
app.post('/api/posts/create', verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id 
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
