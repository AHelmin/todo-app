const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret' //Will need to change in .env

//Register User
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        //check if user exists
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: 'User already exists' });

        //Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Login User & Generate Token
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        //check if user exists
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid username or password' })

        //Compare pass with stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' })

        //Generate JWT token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;