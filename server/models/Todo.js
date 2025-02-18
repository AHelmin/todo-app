const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    text: { type: String, required: true},
    completed: { type: Boolean, default: false},
    createAt: { type: Date, default: Date.now },
});

//Create and export the model
module.exports = mongoose.model('Todo', TodoSchema);