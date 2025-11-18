-- Run once or let server auto-run this SQL on startup.
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  dob TEXT,            -- ISO date string e.g. 2005-07-22
  course TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
