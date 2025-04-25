import React, { useState, useEffect, useCallback, memo } from 'react';
import './Todo.css';

// Task item component optimized with memo
const TaskItem = memo(({ task, onToggle, onEdit, onDelete }) => {
  return (
    <li className={task.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <input
        type="text"
        value={task.text}
        onChange={(e) => onEdit(e.target.value)}
        aria-label={`Edit task: ${task.text}`}
      />
      <button 
        onClick={onDelete}
        aria-label={`Delete task: ${task.text}`}
      >
        Delete
      </button>
    </li>
  );
});

const Todo = () => {
  // Load tasks from local storage on initial render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Generate a unique ID for new tasks
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prevTasks => [
        ...prevTasks, 
        { 
          id: generateId(), 
          text: newTask.trim(), 
          completed: false,
          createdAt: new Date()
        }
      ]);
      setNewTask('');
    }
  }, [newTask]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  }, [addTask]);

  const toggleTask = useCallback((id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const editTask = useCallback((id, newText) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, text: newText } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task"
          aria-label="Enter a new task"
        />
        <button 
          onClick={addTask}
          aria-label="Add task"
        >
          Add
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Add a task to get started!</p>
      ) : (
        <ul className="todo-list" aria-label="Todo list">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onEdit={(newText) => editTask(task.id, newText)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </ul>
      )}
      {tasks.length > 0 && (
        <div className="task-summary">
          <p>{tasks.filter(task => task.completed).length} of {tasks.length} tasks completed</p>
        </div>
      )}
    </div>
  );
};

export default Todo;