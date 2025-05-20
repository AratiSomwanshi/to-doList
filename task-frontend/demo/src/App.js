import React from 'react';
import TaskList from './TaskList';
import './App.css';

function App() {
  return (
    <div className="appContainer">
      <h1 className="appTitle">🚀 Task Manager</h1>
      <TaskList />
    </div>
  );
}

export default App;
