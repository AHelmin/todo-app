import { useState, useEffect } from 'react';
import './App.css'
const API_URL = 'http://localhost:3001/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token')); //store JWT
  const [username, setUsername] = useState('');
  const [authForm, setAuthform] = useState({ username: '', password: '' }); //store login/register input

  //Handle login and registration
  const handleAuth = (type) => {
    fetch(`${API_URL}/auth/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setUsername(data.username);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.error('Auth error: ', err));
  };

  //Fetch todos when logged in
  useEffect(() => {
    if (token) {
      console.log('Fetching todos...')
      fetch(`${API_URL}/todos`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched todos:', data)
          setTodos([...data])
        })

        .catch((err) => console.error('Error fetching todos: ', err));
    }
  }, [token]);

  //  useEffect(() => {
  //   console.log('Updated todos: ', todos)
  //  })

  useEffect(() => {
    console.log("Updated Todos State:", todos);
  }, [todos]); // ✅ This logs todos whenever state updates

  //Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTodos([]);
    setUsername('');
  };

  //Add new todo
  const addTodo = () => {
    if (!newTodo.trim()) return; //prevent empty input

    fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: newTodo }),
    })
      .then((res) => res.json())
      .then((data) => setTodos([...todos, data])); //Update UI with new todo

    setNewTodo(''); //Clear input field
  };

  //Toggle todo (completed/ not completed)
  const toggleTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((updatedTodo) =>
        setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)))
      );
  };

  //delete todo
  const deleteTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)));
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      {!token ? (
        <div className='auth-container'>
          <h2>Login or Register</h2>
          <input
            type='text'
            placeholder='Username'
            value={authForm.username}
            onChange={(e) => setAuthform({ ...authForm, username: e.target.value })}
          />
          <input
            type='password'
            placeholder='Password'
            value={authForm.password}
            onChange={(e) => setAuthform({ ...authForm, password: e.target.value })}
          />
          <button onClick={() => handleAuth('login')}>Login</button>
          <button onClick={() => handleAuth('register')}>Register</button>
        </div>
      ) : (
        <>
          <p>Welcome, {username}!</p>
          <button onClick={logout}>Logout</button>

          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Add a new todo'
          />
          <button onClick={addTodo}>Add</button>

          <ul>
            {todos.length === 0 && <p>No Todos Available</p>}

            {todos.map((todo, index) => (
              <li key={todo._id || index}> {/* Use index as fallback for missing _id */}
                <span
                  className={todo.completed ? "completed" : ""}
                  onClick={() => toggleTodo(todo._id)}
                >
                  {todo.text || "(No text)"} {/* Show "(No text)" if text is missing */}
                </span>
                <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>❌</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App
