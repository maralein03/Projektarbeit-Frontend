import React, { useState } from 'react';
import { Todo, TodoStatus } from '../types';
import { todoService } from '../services/todoService';
import '../styles/TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onSelect: (todo: Todo) => void;
  isInstructor: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onSelect,
  isInstructor,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: TodoStatus) => {
    try {
      setIsUpdatingStatus(true);
      const updated = await todoService.updateTodoStatus(todo.id, newStatus);
      onUpdate(updated);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Fehler beim Aktualisieren des Status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAccept = async () => {
    try {
      setIsUpdatingStatus(true);
      const updated = await todoService.acceptTodo(todo.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Error accepting todo:', error);
      alert('Fehler beim Annehmen der Aufgabe');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: TodoStatus) => {
    const colors: Record<TodoStatus, string> = {
      Open: '#ff6b6b',
      'In Progress': '#ffd93d',
      Done: '#6bcf7f',
      Accepted: '#4d96ff',
    };
    return colors[status] || '#999';
  };

  return (
    <div className="todo-item">
      <div className="todo-header">
        <h3 onClick={() => onSelect(todo)} className="todo-title">
          {todo.title}
        </h3>
        <span
          className="todo-status"
          style={{ backgroundColor: getStatusColor(todo.status) }}
        >
          {todo.status}
        </span>
      </div>
      <p className="todo-description">{todo.description}</p>
      <div className="todo-meta">
        <span>Zugewiesen an: <strong>{todo.assignTo}</strong></span>
        <span>Erstellt: {new Date(todo.createdAt).toLocaleDateString('de-DE')}</span>
      </div>

      <div className="todo-actions">
        {!isInstructor && (
          <>
            <button
              onClick={() => handleStatusChange('In Progress')}
              disabled={isUpdatingStatus || todo.status === 'Done'}
              className="btn-secondary"
            >
              In Bearbeitung
            </button>
            <button
              onClick={() => handleStatusChange('Done')}
              disabled={isUpdatingStatus}
              className="btn-secondary"
            >
              Erledigt
            </button>
            <button
              onClick={handleAccept}
              disabled={isUpdatingStatus || todo.status !== 'Done'}
              className="btn-primary"
            >
              Annehmen
            </button>
          </>
        )}
        {isInstructor && (
          <>
            <button
              onClick={() => handleStatusChange('Open')}
              disabled={isUpdatingStatus}
              className="btn-secondary"
            >
              Zurücksetzen
            </button>
            <button
              onClick={() => onSelect(todo)}
              className="btn-primary"
            >
              Bearbeiten
            </button>
          </>
        )}
      </div>
    </div>
  );
};


