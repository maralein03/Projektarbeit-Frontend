import React from 'react';
import { Todo } from '../types';
import { QuestionList } from './QuestionList';
import { useAuth } from '../context/AuthContext';
import '../styles/TodoDetail.css';

interface TodoDetailProps {
  todo: Todo;
  onClose: () => void;
  onUpdate: (todo: Todo) => void;
}

export const TodoDetail: React.FC<TodoDetailProps> = ({ todo, onClose, onUpdate }) => {
  const { hasRole } = useAuth();
  const isInstructor = hasRole('ROLE_UPDATE');

  return (
    <div className="todo-detail-overlay">
      <div className="todo-detail-modal">
        <div className="modal-header">
          <h2>{todo.title}</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="todo-detail-section">
            <h3>Aufgabendetails</h3>
            <div className="detail-row">
              <label>Status:</label>
              <span className="status-badge">{todo.status}</span>
            </div>
            <div className="detail-row">
              <label>Zugewiesen an:</label>
              <span>{todo.assignTo}</span>
            </div>
            <div className="detail-row">
              <label>Erstellt am:</label>
              <span>{new Date(todo.createdAt).toLocaleDateString('de-DE')}</span>
            </div>
            <div className="detail-row full-width">
              <label>Beschreibung:</label>
              <p className="description">{todo.description || 'Keine Beschreibung'}</p>
            </div>
          </div>

          <QuestionList todoId={todo.id} />
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
