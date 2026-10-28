# Employee Task Tracker

A full-stack web application for creating, assigning, and tracking employee tasks. The application provides a dashboard to monitor task progress, manage priorities, and organize work efficiently.

Built using **React**, **FastAPI**, and **SQLite**, the project demonstrates frontend development, REST API integration, database operations, and CRUD functionality.

## Features

- **Dashboard Overview:** Displays the total number of tasks and counts for Pending, In Progress, and Completed tasks.
- **Create Tasks:** Add tasks with a title, description, priority, and assigned employee.
- **View Tasks:** Retrieve and display tasks stored in the database.
- **Update Task Status:** Change a task's status as work progresses.
- **Delete Tasks:** Remove tasks that are no longer required.
- **Priority Management:** Supports Low, Medium, and High priority levels.
- **Input Validation:** Validates required fields, priority values, and task statuses.
- **Persistent Storage:** Stores task records in an SQLite database.
- **REST API:** Provides endpoints for communication between the frontend and backend.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic

### Database
- SQLite

### Development Tools
- Git
- GitHub
- Visual Studio Code

## Project Structure

```text
employee-task-tracker/
├── backend/
│   ├── main.py
│   ├── database.py
│   └── tasks.db
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

The SQLite database file is generated automatically when the backend starts. It is excluded from version control.

## Prerequisites

Ensure the following are installed:

- Python 3.10 or later
- Node.js and npm
- Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/R17dotcom/employee-task-tracker.git
cd employee-task-tracker
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install fastapi uvicorn
```

Start the FastAPI server:

```bash
python -m uvicorn main:app --reload
```

The backend will run at:

`http://127.0.0.1:8000`

Interactive API documentation is available at:

`http://127.0.0.1:8000/docs`

Keep the backend terminal running.

### 3. Set Up the Frontend

Open a **second terminal** in the project root and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal. By default, Vite usually uses:

`http://localhost:5173`

Keep the frontend terminal running while using the application.

## API Endpoints

The backend exposes the following REST API endpoints:

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API availability |
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/{task_id}` | Retrieve a task by ID |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/{task_id}` | Update a task's status |
| DELETE | `/tasks/{task_id}` | Delete a task by ID |

### Task Attributes

Each task contains the following information:

| Attribute | Description |
|---|---|
| `id` | Unique task identifier |
| `title` | Task title |
| `description` | Additional task details |
| `priority` | Low, Medium, or High |
| `assigned_employee` | Employee assigned to the task |
| `status` | Pending, In Progress, or Completed |
| `created_at` | Timestamp when the task was created |

## Database Design

The application uses SQLite for local data persistence.

The `tasks` table stores task details, including the task identifier, title, description, priority, assigned employee, status, and creation timestamp.

The database table is created automatically when the FastAPI application starts.

## Application Workflow

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the FastAPI backend.
3. The backend validates incoming data and executes database operations.
4. SQLite stores or retrieves task information.
5. The backend returns responses to the frontend.
6. The dashboard displays the current tasks and updated statistics.

## Future Enhancements

Potential improvements include:

- Employee authentication and role-based access.
- Task due dates and deadline tracking.
- Search, filtering, and sorting.
- Employee-specific dashboards.
- Task assignment notifications.
- Automated testing and deployment.

## Author

Developed as a full-stack Employee Task Tracker application.

## License

No license has been specified for this project.
