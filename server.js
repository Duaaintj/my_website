const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("error", err.message);
    else console.log("done");
});

// Create table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Registration route
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    db.run(sql, [username, email, password], function(err) {
        if (err) {
            return res.status(400).json({ message: "This email address is already in use." });
        }
        res.json({ message: "Registration successful! Your data has been saved." });
    });
});

app.use(express.static('images'));
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/api/test', (req, res) => {
    res.json({ message: "done" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

