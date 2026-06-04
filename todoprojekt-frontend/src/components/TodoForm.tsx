import React, { useState } from 'react';
import { Todo, TodoStatus } from '../types';
import { todoService } from '../services/todoService';
import '../styles/TodoForm.css';

interface TodoFormProps {
  todo?: Todo | null;
  onSubmit: (todo: Todo) => void;
  onCancel: () => void;
  isNew: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel, isNew }) => {
  const [formData, setFormData] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    assignTo: todo?.assignTo || '',
    status: (todo?.status || 'Open') as TodoStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Titel ist erforderlich');
      return;
    }

    try {
      setIsSubmitting(true);
      let result;

      if (isNew) {
        result = await todoService.createTodo({
          title: formData.title,
          description: formData.description,
          assignTo: formData.assignTo,
          status: formData.status,
        });
      } else if (todo) {
        result = await todoService.updateTodo(todo.id, formData);
      } else {
        throw new Error('Keine Todo ausgewählt');
      }

      onSubmit(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Speichern';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!todo || !window.confirm('Diese Todo wirklich löschen?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      await todoService.deleteTodo(todo.id);
      onCancel();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fehler beim Löschen';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="todo-form">
      <form onSubmit={handleSubmit}>
        <h2>{isNew ? 'Neue Todo erstellen' : 'Todo bearbeiten'}</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="title">Titel *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Todo Titel"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Beschreibung</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detaillierte Beschreibung der Aufgabe"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignTo">Zugewiesen an *</label>
          <input
            type="text"
            id="assignTo"
            name="assignTo"
            value={formData.assignTo}
            onChange={handleChange}
            placeholder="Name des Lernenden"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Open">Offen</option>
            <option value="In Progress">In Bearbeitung</option>
            <option value="Done">Erledigt</option>
            <option value="Accepted">Akzeptiert</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Wird gespeichert...' : 'Speichern'}
          </button>
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-secondary">
            Abbrechen
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="btn-danger"
            >
              Löschen
            </button>
          )}
        </div>
      </form>
    </div>
  );
};


