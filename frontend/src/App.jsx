import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "/api/tasks";
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError("");
    } catch {
      setError("Could not load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      await axios.post(API_URL, {
        title: title.trim(),
      });

      setTitle("");
      fetchTasks();
      setError("");
    } catch {
      setError("Could not create task");
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await axios.patch(`${API_URL}/${taskId}`);
      fetchTasks();
      setError("");
    } catch {
      setError("Could not update task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      fetchTasks();
      setError("");
    } catch {
      setError("Could not delete task");
    }
  };

  return (
    <main className="container">
      <h1>Task Platform</h1>
      <p className="subtitle">Kubernetes portfolio application</p>

      <form onSubmit={createTask} className="task-form">
        <input
          type="text"
          placeholder="Enter a new task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit">Add task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <article className="task" key={task.id}>
              <span
                className={task.completed ? "completed" : ""}
                onClick={() => toggleTask(task.id)}
              >
                {task.title}
              </span>

              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;