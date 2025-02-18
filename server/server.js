const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

//call connect function from connection.js
db();

//Middleware
app.use(express.json());
app.use(cors());

//Test route
app.get('/', (req,res) => {
    res.send('Server is running!')
});

//import and use todo routes
const todoRoutes = require('./routes/todoRoutes')
app.use('/api/todos', todoRoutes)

//import and use auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});