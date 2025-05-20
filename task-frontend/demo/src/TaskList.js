import React, { useEffect, useState } from 'react';
import './TaskList.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchTasks = () => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })
      .then(res => res.json())
      .then(() => {
        setNewTitle('');
        fetchTasks();
      })
      .catch(err => console.error('Error adding task:', err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks())
      .catch(err => console.error('Error deleting task:', err));
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  const saveEditing = (id) => {
    if (!editTitle.trim()) return;

    fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    })
      .then(res => res.json())
      .then(() => {
        setEditingTaskId(null);
        setEditTitle('');
        fetchTasks();
      })
      .catch(err => console.error('Error updating task:', err));
  };

  const emojis = ['📚', '✅', '🚀', '💻', '🎯', '📝', '🧹', '😍'];

  return (
    <div className="container">
      <h2 className="title">📋 Task List</h2>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          placeholder="Enter task title"
          className="input"
        />
        <button type="submit" className="button">
          Add Task
        </button>
        <div className="emojiContainer">
          {emojis.map((emoji, index) => (
            <span
              key={index}
              onClick={() => setNewTitle(newTitle + ' ' + emoji)}
              className="emoji"
            >
              {emoji}
            </span>
          ))}
        </div>
      </form>

      {/* Task list */}
      <ul className="taskList">
        {tasks.map(task => (
          <li key={task.id} className="taskCard">
            <div>
              {editingTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="editInput"
                  />
                  <div className="buttonGroup">
                    <button
                      onClick={() => saveEditing(task.id)}
                      className="saveButton"
                    >
                      Save
                    </button>
                    <button onClick={cancelEditing} className="cancelButton">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <strong className="taskTitle">{task.title}</strong>
                  <div className="taskDate">
                    {new Date(task.created_at).toLocaleString()}
                  </div>
                </>
              )}
            </div>

            {editingTaskId !== task.id && (
              <div className="actionButtons">
                <button
                  onClick={() => startEditing(task)}
                  className="editButton"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="deleteButton"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
