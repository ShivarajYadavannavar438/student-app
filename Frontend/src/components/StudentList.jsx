import React from 'react';

export default function StudentList({ students = [], onEdit, onDelete }) {
  if (students.length === 0) return <p>No students yet.</p>;

  return (
    <table className="student-table">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Email</th><th>DOB</th><th>Course</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.firstName} {s.lastName}</td>
            <td>{s.email}</td>
            <td>{s.dob ? new Date(s.dob).toLocaleDateString() : '-'}</td>
            <td>{s.course || '-'}</td>
            <td>
              <button onClick={() => onEdit(s)}>Edit</button>
              <button onClick={() => onDelete(s.id)} className="danger">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
