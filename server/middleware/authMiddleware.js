const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret'; //change in .env

const authMiddleWare = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied'});

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        req.user = decoded.userId;
        next();
    } catch(err) {
        res.status(401).json({ message: 'Invalid token '});
    }
};

module.exports = authMiddleWare;