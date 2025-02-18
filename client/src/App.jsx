import { useState, useEffect } from 'react';
import './App.css'
const API_URL = 'http://localhost:3001/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  //Fetch todos from backend when the page loads
  useEffect(() => {
    fetch(API_URL)
    .then((res) => res.json())
    .then((data) => setTodos(data))
    .catch((err) => console.error('Error fetching todos:', err))
  }, []);

//Add new todo
const addTodo = () => {
  if (!newTodo.trim()) return; //prevent empty input

  fetch(API_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newTodo }),
  })
  .then((res) => res.json())
  .then((data) => setTodos([...todos, data])); //Update UI with new todo

  setNewTodo(''); //Clear input field
};

//Toggle todo (completed/ not completed)
const toggleTodo = (id) => {
  fetch(`${API_URL}/${id}`, { method: 'PUT' })
  .then((res) => res.json())
  .then((updatedTodo) => 
  setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)))
  );
};

//delete todo
const deleteTodo = (id) => {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  .then(() => setTodos(todos.filter((todo) => todo._id !== id)));
};

return (
  <div className="container">
    <h1>Todo List</h1>
    <input
      type="text"
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
      placeholder="Add a new task"
    />
    <button onClick={addTodo}>Add</button>

    <ul>
      {todos.map((todo) => (
        <li key={todo._id}>
          <span
            className={todo.completed ? "completed" : ""}
            onClick={() => toggleTodo(todo._id)}
          >
            {todo.text}
          </span>
          <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>❌</button>
        </li>
      ))}
    </ul>
  </div>
);
}

export default App
