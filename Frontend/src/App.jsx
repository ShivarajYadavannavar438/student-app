import React, { useEffect, useState } from 'react';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function App() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (e) {
      console.error(e);
      alert('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleCreate(student) {
    const res = await fetch(`${API}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Create failed');
      return;
    }
    const data = await res.json();
    setStudents(prev => [data, ...prev]);
  }

  async function handleUpdate(id, updated) {
    const res = await fetch(`${API}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Update failed');
      return;
    }
    const data = await res.json();
    setStudents(prev => prev.map(s => (s.id === id ? data : s)));
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this student?')) return;
    const res = await fetch(`${API}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Delete failed');
      return;
    }
    setStudents(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="container">
      <h1>Student Registration</h1>
      <div className="card">
        <StudentForm
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editing={editing}
          onCancel={() => setEditing(null)}
        />
      </div>

      <div className="card">
        <h2>Students {loading ? ' (loading...)' : ''}</h2>
        <StudentList
          students={students}
          onEdit={(s) => setEditing(s)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
