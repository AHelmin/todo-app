const express = require('express');
const Todo = require('../models/Todo');
const authMiddleWare = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get all todos
router.get("/", authMiddleWare, async (req, res) => {
    try {
        console.log("Authenticated User ID:", req.user); // ✅ Check logged-in user
        const todos = await Todo.find({ user: req.user }); // Fetch todos by logged in user from MongoDB
        console.log("Todos from Database:", todos); // ✅ See if todos exist
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Create a new todo
router.post("/", authMiddleWare, async (req, res) => {
    try {
        console.log("Logged-in User ID:", req.user); // ✅ Confirming user ID
        
        const newTodo = new Todo({ 
            text: req.body.text,
            completed: false,
            user: req.user, //assign todo to logged in user 
        }); // Create a new todo object
        await newTodo.save(); // Save to database
        res.status(201).json(newTodo); // Return the created todo
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Toggle todo completion
router.put("/:id", authMiddleWare, async (req, res) => {
    try {
        const todo = await Todo.findById({ _id: req.params.id, user: req.user });
        if (!todo) return res.status(404).json({ message: "Todo not found or unauthorized" });

        todo.completed = !todo.completed; // Toggle completion
        await todo.save();
        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete a todo
router.delete("/:id", authMiddleWare, async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete({ _id: req.params.id, user: req.user });
        if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });

        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
