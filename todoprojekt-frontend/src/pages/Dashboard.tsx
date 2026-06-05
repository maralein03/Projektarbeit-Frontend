import React, { useState, useEffect } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { TodoDetail } from '../components/TodoDetail';
import { Todo, TodoStatus } from '../types';
import { todoService } from '../services/todoService';

export const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { todos, isLoading, error, fetchTodos } = useTodos();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewTodo, setIsNewTodo] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState<TodoStatus | 'ALL'>('ALL');

  // Greift exakt auf die Keycloak-Rolle 'UPDATE' zu
  const isInstructor = hasRole('UPDATE');

  useEffect(() => {
    console.log("=== AUTH DIAGNOSE ===");
    console.log("Eingeloggter User:", user);
    console.log("Hat 'UPDATE'?", isInstructor);
  }, [user, isInstructor]);

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  const handleOpenNewTodoForm = () => {
    setSelectedTodo(null);
    setIsNewTodo(true);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (todoData?: any) => {
    try {
      if (isNewTodo && todoData) {
        await todoService.createTodo(todoData);
      } else if (!isNewTodo && selectedTodo && todoData) {
        await todoService.updateTodo(selectedTodo.id, todoData);
      }

      await fetchTodos();
      setIsFormOpen(false);
      setIsNewTodo(false);
      setSelectedTodo(null); 
    } catch (err) {
      console.error('Fehler beim Speichern der Aufgabe:', err);
      alert('Speichern fehlgeschlagen. Überprüfe die Eingaben oder deine Berechtigung.');
    }
  };

  const handleTodoUpdate = async (updatedTodo: Todo) => {
    await fetchTodos();
    if (selectedTodo?.id === updatedTodo.id) {
      setSelectedTodo(updatedTodo);
    }
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedTodo(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTodo(null);
  };

  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'ALL') return true;
    return todo.status === activeFilter;
  });

  return (
    <div className="dashboard" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'Segoe UI, Roboto, sans-serif' }}>
      <Header onFilterChange={setActiveFilter} activeFilter={activeFilter} />

      <main className="dashboard-main" style={{ padding: '30px max(20px, 4%)' }}>
        {isLoading && <div className="loading-spinner" style={{ textAlign: 'center', padding: '20px', color: '#0066cc', fontWeight: 'bold' }}>Lädt Aufgaben...</div>}
        {error && <div className="error-message" style={{ backgroundColor: '#ffe6e6', color: '#cc0000', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{error}</div>}

        <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px', alignItems: 'start' }}>
          
          {/* Linke Seite: Aufgaben-Liste */}
          <div className="dashboard-left">
            <TodoList
              todos={filteredTodos}
              onTodoSelect={handleSelectTodo}
              onTodoUpdate={handleTodoUpdate}
              isInstructor={isInstructor}
            />
          </div>

          {/* Rechte Seite: Kontroll-Zentrum */}
          <div className="dashboard-right" style={{ position: 'sticky', top: '100px' }}>
            {isInstructor ? (
              <div className="instructor-panel" style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e1e8ed', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a', fontSize: '1.2rem' }}>👨‍🏫 Ausbilder-Bereich</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Erstellen und verwalten Sie Aufgaben für Ihre Lernenden.</p>
                <button 
                  onClick={handleOpenNewTodoForm} 
                  className="btn-primary btn-large"
                  style={{ width: '100%', padding: '12px 20px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0052a3'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
                >
                  <span>➕</span> Neue Aufgabe erstellen
                </button>
              </div>
            ) : (
              <div className="instructor-panel-locked" style={{ padding: '20px', backgroundColor: '#eef2f5', borderRadius: '12px', color: '#667085', border: '1px dashed #bcccda', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>ℹ️ Ausbilder-Funktionen ausgeblendet (Standard-Lernenden-Profil).</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail-Ansicht */}
      {isDetailOpen && selectedTodo && (
        <TodoDetail
          todo={selectedTodo}
          onClose={handleCloseDetail}
          onUpdate={handleTodoUpdate}
        />
      )}

      {/* Das wunderschöne, bereinigte Overlay-Formular */}
      {isFormOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="modal-container" style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            <TodoForm
              todo={isNewTodo ? null : selectedTodo}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseForm}
              isNew={isNewTodo}
            />
          </div>
        </div>
      )}
    </div>
  );
};