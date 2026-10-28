import sqlite3
from pathlib import Path
DATABASE_PATH=Path(__file__).parent/"tasks.db"
def get_connection():
    connection =sqlite3.connect(DATABASE_PATH)
    connection.row_factory=sqlite3.Row
    return connection
def create_table():
    connection=get_connection()
    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            priority TEXT NOT NULL DEFAULT 'Medium',
            assigned_employee TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    connection.commit()
    connection.close()
