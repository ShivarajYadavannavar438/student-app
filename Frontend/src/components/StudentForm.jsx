import React, { useEffect, useState } from 'react';

export default function StudentForm({ onCreate, onUpdate, editing, onCancel }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    course: ''
  });

  useEffect(() => {
    if (editing) {
      setForm({
        firstName: editing.firstName || '',
        lastName: editing.lastName || '',
        email: editing.email || '',
        dob: editing.dob ? editing.dob.split('T')[0] : '',
        course: editing.course || ''
      });
    } else {
      setForm({ firstName: '', lastName: '', email: '', dob: '', course: '' });
    }
  }, [editing]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      alert('First name, last name and email are required.');
      return;
    }
    if (editing) {
      onUpdate(editing.id, form);
    } else {
      onCreate(form);
    }
    setForm({ firstName: '', lastName: '', email: '', dob: '', course: '' });
  }

  return (
    <form onSubmit={submit} className="form">
      <h2>{editing ? 'Edit Student' : 'Register Student'}</h2>

      <div className="row">
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
      </div>

      <div className="row">
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="dob" type="date" value={form.dob} onChange={handleChange} placeholder="Date of Birth" />
      </div>

      <div className="row">
        <input name="course" value={form.course} onChange={handleChange} placeholder="Course" />
      </div>

      <div className="row actions">
        <button type="submit">{editing ? 'Save' : 'Register'}</button>
        {editing && <button type="button" onClick={onCancel} className="muted">Cancel</button>}
      </div>
    </form>
  );
}
