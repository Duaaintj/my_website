const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static('images'));

// 1. Database Connection 
const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_CONNECTION_STRING_HERE';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// 2. User Registration Route
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    console.log("Data received:", username, email);
    res.json({ message: "Registration successful" });
});

// 3. Server Test Route
app.get('/api/test', (req, res) => {
    res.json({ message: "The server is working successfully" });
});

// 4. Article Schema & Model
const articleSchema = new mongoose.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// 5. API Route to Create a New Article
app.post('/api/posts', async (req, res) => {
    try {
        const { author, title, content } = req.body;

        if (!author || !title || !content) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newArticle = new Article({ author, title, content });
        await newArticle.save();

        res.status(201).json({ message: 'Article published successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Failed to publish article.' });
    }
});

// 6. Start Server (Compatible with Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
