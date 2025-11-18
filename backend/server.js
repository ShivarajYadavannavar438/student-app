// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Helper: validate student payload
function validateStudent(payload) {
  const { firstName, lastName, email } = payload;
  if (!firstName || !lastName || !email) {
    return 'firstName, lastName and email are required.';
  }
  // basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format.';
  return null;
}

// CREATE
app.post('/api/students', (req, res) => {
  const err = validateStudent(req.body);
  if (err) return res.status(400).json({ error: err });

  const { firstName, lastName, email, dob = null, course = null } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO students (firstName, lastName, email, dob, course) VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(firstName, lastName, email, dob, course);
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(student);
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    console.error(e);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// READ ALL
app.get('/api/students', (req, res) => {
  const rows = db.prepare('SELECT * FROM students ORDER BY id DESC').all();
  res.json(rows);
});

// READ ONE
app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Student not found.' });
  res.json(row);
});

// UPDATE
app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const err = validateStudent(req.body);
  if (err) return res.status(400).json({ error: err });

  const { firstName, lastName, email, dob = null, course = null } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE students SET firstName = ?, lastName = ?, email = ?, dob = ?, course = ?
      WHERE id = ?
    `);
    const info = stmt.run(firstName, lastName, email, dob, course, id);
    if (info.changes === 0) return res.status(404).json({ error: 'Student not found.' });
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    res.json(student);
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    console.error(e);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE
app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const stmt = db.prepare('DELETE FROM students WHERE id = ?');
  const info = stmt.run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Student not found.' });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Student API running on http://localhost:${PORT}`);
});
