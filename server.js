const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    console.log("Data has been replaced", username, email);
    res.json({ message: "Registration successful" });
});
app.use(express.static('images'));
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));


app.use(express.static(__dirname));


app.get('/api/test', (req, res) => {
    res.json({ message: "The server is working successfully" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
    console.log(`The server is now running on the link: http://localhost:${PORT}`);
});


// Article Schema & Model
const articleSchema = new mongoose.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);

// API Route to Create a New Article
app.post('/api/posts', async (req, res) => {
    try {
        const { author, title, content } = req.body;

        if (!author || !title || !content) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newArticle = new Article({
            author,
            title,
            content
        });

        await newArticle.save();

        res.status(201).json({ message: 'Article published successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Failed to publish article.' });
    }
});
