import { useEffect, useState } from "react";
import "./App.css";
const API_URL="http://127.0.0.1:8000";
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    assigned_employee: "",
  });
  async function fetchTasks() {
    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks`);

      if (!response.ok) {
        throw new Error("Could not load tasks.");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("Unable to connect to the server. Check your backend.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchTasks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }
  async function addTask(event) {
    event.preventDefault();

    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Could not create task."
        );
      }
      setForm({
        title: "",
        description: "",
        priority: "Medium",
        assigned_employee: "",
      });

      await fetchTasks();
    } catch (err) {
      setError(err.message || "Could not create task.");
    }
  }
  async function updateStatus(taskId, newStatus) {
    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Could not update task status.");
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message || "Could not update task.");
    }
  }
  async function deleteTask(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete task.");
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message || "Could not delete task.");
    }
  }
  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">WORKSPACE / TASK MANAGEMENT</p>
          <h1>Employee Task Tracker</h1>
          <p className="subtitle">
            Organize work. Track progress. Get things done.
          </p>
        </div>
        <div className="live-badge">
          <span className="live-dot"></span>
          System Online
        </div>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span className="stat-label">Total Tasks</span>
          <strong>{tasks.length}</strong>
          <span className="stat-note">All assigned tasks</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>{pending}</strong>
          <span className="stat-note">Waiting to begin</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">In Progress</span>
          <strong>{inProgress}</strong>
          <span className="stat-note">Currently underway</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <strong>{completed}</strong>
          <span className="stat-note">Successfully finished</span>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">CREATE</p>
              <h2>Add a New Task</h2>
            </div>
            <span className="heading-icon">+</span>
            </div>
            <form onSubmit={addTask}>
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Prepare monthly report"
              maxLength={150}
              required
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details about the task..."
              rows="3"
            />
            <label htmlFor="assigned_employee">Assign Employee *</label>
            <input
              id="assigned_employee"
              name="assigned_employee"
              value={form.assigned_employee}
              onChange={handleChange}
              placeholder="Employee name"
              maxLength={100}
              required
            />

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button className="primary-button" type="submit">
              + Create Task
            </button>
          </form>
        </section>

        <section className="panel task-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h2>Task Directory</h2>
            </div>
            <span className="task-count">{tasks.length} tasks</span>
          </div>

          {error && <p className="error-message">{error}</p>}

          {loading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">◇</span>
              <h3>No tasks yet</h3>
              <p>Create your first task using the form.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Employee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.title}</strong>
                        <small>{task.description || "No description"}</small>
                      </td>

                      <td>{task.assigned_employee}</td>

                      <td>
                        <span
                          className={`priority priority-${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td>
                        <select
                          className="status-select"
                          value={task.status}
                          aria-label={`Status for ${task.title}`}
                          onChange={(event) =>
                            updateStatus(task.id, event.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>

                      <td>
                        <button
                          className="delete-button"
                          onClick={() => deleteTask(task.id)}
                          aria-label={`Delete ${task.title}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <footer>
        Employee Task Tracker <span>•</span> React <span>•</span> FastAPI{" "}
        <span>•</span> SQLite
      </footer>
    </main>
  );
}

export default App;


