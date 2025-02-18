const express = require('express');
const Todo = require('../models/Todo');

const router = express.Router();

// ✅ Get all todos
router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find(); // Fetch all todos from MongoDB
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Create a new todo
router.post("/", async (req, res) => {
    try {
        const newTodo = new Todo({ text: req.body.text }); // Create a new todo object
        await newTodo.save(); // Save to database
        res.status(201).json(newTodo); // Return the created todo
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Toggle todo completion
router.put("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.completed = !todo.completed; // Toggle completion
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete a todo
router.delete("/:id", async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
