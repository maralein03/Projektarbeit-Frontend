import React, { useState, useEffect } from 'react';
import { Todo, TodoStatus } from '../types';

interface TodoFormProps {
  todo: Todo | null;
  onSubmit: (todoData: any) => void;
  onCancel: () => void;
  isNew: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit, onCancel, isNew }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState<TodoStatus>('OPEN');

  useEffect(() => {
    if (todo && !isNew) {
      setTitle(todo.title);
      setDescription(todo.description);
      setAssignedTo(todo.assignedTo || '');
      setStatus(todo.status);
    } else {
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setStatus('OPEN');
    }
  }, [todo, isNew]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo.trim()) {
      alert('Bitte füllen Sie alle Pflichtfelder (*) aus.');
      return;
    }
    onSubmit({ title, description, assignedTo, status });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '6px' }}>
        <h3 style={{ margin: 0, color: '#1a1a1a', fontSize: '1.3rem' }}>
          {isNew ? '✨ Neue Todo erstellen' : '📝 Aufgabe bearbeiten'}
        </h3>
      </div>

      {/* Titel-Eingabe */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Titel *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="z.B. Keycloak-Anbindung testen"
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
          required
        />
      </div>

      {/* Beschreibung */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Beschreibung</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detaillierte Beschreibung der Aufgabe..."
          rows={4}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {/* Zugewiesen an */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Zuweisen an (Lernender) *</label>
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Name des Lernenden eingeben"
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }}
          required
        />
      </div>

      {/* Status-Auswahl */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#4a5568' }}>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TodoStatus)}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', backgroundColor: '#fff', outline: 'none', cursor: 'pointer' }}
        >
          <option value="OPEN">Offen</option>
          <option value="IN_PROGRESS">In Arbeit</option>
          <option value="DONE">Erledigt</option>
          <option value="ACCEPTED">Akzeptiert</option>
        </select>
      </div>

      {/* Aktions-Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '10px 18px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
        >
          Abbrechen
        </button>
        <button
          type="submit"
          style={{ padding: '10px 22px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,102,204,0.2)' }}
        >
          Speichern
        </button>
      </div>
    </form>
  );
};