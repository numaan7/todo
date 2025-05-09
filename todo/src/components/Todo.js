import React, { useState, useEffect, useCallback, memo, useReducer } from 'react';
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
        className="delete-btn"
      >
        🗑️ Delete
      </button>
    </li>
  );
});

// Task reducer for better state management
function tasksReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.tasks;
    case 'ADD':
      return [...state, action.task];
    case 'TOGGLE':
      return state.map(task => 
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case 'EDIT':
      return state.map(task => 
        task.id === action.id ? { ...task, text: action.text } : task
      );
    case 'DELETE':
      return state.filter(task => task.id !== action.id);
    default:
      return state;
  }
}

const Todo = () => {
  // Using reducer for complex state management
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from local storage on initial render
  useEffect(() => {
    try {
      const loadTasks = () => {
        setIsLoading(true);
        const savedTasks = localStorage.getItem('tasks');
        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
        dispatch({ type: 'INIT', tasks: parsedTasks });
        setIsLoading(false);
      };
      
      loadTasks();
    } catch (error) {
      console.error('Error loading tasks:', error);
      setIsLoading(false);
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    }
  }, [tasks, isLoading]);

  // Generate a unique ID for new tasks
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }, []);

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      const task = { 
        id: generateId(), 
        text: newTask.trim(), 
        completed: false,
        createdAt: new Date()
      };
      dispatch({ type: 'ADD', task });
      setNewTask('');
    }
  }, [newTask, generateId]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  }, [addTask]);

  const toggleTask = useCallback((id) => {
    dispatch({ type: 'TOGGLE', id });
  }, []);

  const editTask = useCallback((id, newText) => {
    dispatch({ type: 'EDIT', id, text: newText });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: 'DELETE', id });
  }, []);

  // Show loading spinner while tasks are being loaded
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <h1>✅ Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="✨ Add a new task"
          aria-label="Enter a new task"
        />
        <button 
          onClick={addTask}
          aria-label="Add task"
          className="add-btn"
        >
          ➕ Add
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="empty-state">📝 No tasks yet. Add a task to get started!</p>
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
          <p>🎯 {tasks.filter(task => task.completed).length} of {tasks.length} tasks completed {tasks.filter(task => task.completed).length === tasks.length && tasks.length > 0 ? '🎉' : '🚀'}</p>
        </div>
      )}
    </div>
  );
};

export default Todo;