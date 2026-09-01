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
