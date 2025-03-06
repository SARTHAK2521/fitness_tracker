const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ✅ Helper function to read users
function getUsers() {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // File nahi mili toh empty array return karo
    }
}

// ✅ Signup Route
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    let users = getUsers();

    // ✅ Check if username already exists
    if (users.some(u => u.username.trim().toLowerCase() === username.trim().toLowerCase())) {
        return res.render('auth', { error: "Username already exists" });
    }

    // ✅ Add new user
    const newUser = { username: username.trim(), password };
    users.push(newUser);

    // ✅ Write updated users list to JSON file
    fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2));

    res.redirect('/auth/login'); // ✅ Redirect to login page
});

// ✅ Login Route
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    let users = getUsers();

    // ✅ Check if user exists
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.render('auth', { error: "Invalid username or password" });
    }

    res.redirect('/'); // ✅ Successful login
});

module.exports = router;
