import React, { useState } from 'react';
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
  
  // NEU: State für den aktuell ausgewählten Status-Filter
  const [activeFilter, setActiveFilter] = useState<TodoStatus | 'ALL'>('ALL');

  // Rolle prüfen (Ausbilder)
  const isInstructor = hasRole('ROLE_UPDATE');

  // Aufgabe auswählen -> Detail-Ansicht öffnen
  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  // Neues Todo erstellen (Formular als "Neu" öffnen)
  const handleOpenNewTodoForm = () => {
    setSelectedTodo(null);
    setIsNewTodo(true);
    setIsFormOpen(true);
  };

  // Falls du später eine bestehende Aufgabe bearbeiten willst:
  const handleOpenEditTodoForm = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsNewTodo(false);
    setIsFormOpen(true);
  };

  // NEU: Nach dem Erstellen/Bearbeiten im Formular die Daten verarbeiten
  const handleFormSubmit = async (todoData?: any) => {
    try {
      if (isNewTodo && todoData) {
        // Neue Aufgabe erstellen
        await todoService.createTodo(todoData);
      } else if (!isNewTodo && selectedTodo && todoData) {
        // Bestehende Aufgabe editieren
        await todoService.updateTodo(selectedTodo.id, todoData);
      }

      // Nach Erfolg: Liste vom Server neu ziehen
      await fetchTodos();
      setIsFormOpen(false);
      setIsNewTodo(false);
      setSelectedTodo(null); 
    } catch (err) {
      console.error('Fehler beim Speichern der Aufgabe:', err);
      alert('Speichern fehlgeschlagen. Überprüfe die Eingaben oder deine Berechtigung.');
    }
  };

  // Wenn sich der Status im List-Eintrag direkt ändert
  const handleTodoUpdate = async (updatedTodo: Todo) => {
    await fetchTodos();
    // Falls das gerade geöffnete Detail-Fenster betroffen ist, State synchronisieren
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

  // NEU: To-Dos filtern, bevor sie an <TodoList /> gegeben werden
  const filteredTodos = todos.filter(todo => {
    if (activeFilter === 'ALL') return true;
    return todo.status === activeFilter;
  });

  return (
    <div className="dashboard">
      {/* NEU: Wir übergeben den Filter-State und die Setter-Funktion an den Header */}
      <Header onFilterChange={setActiveFilter} activeFilter={activeFilter} />

      <main className="dashboard-main">
        {isLoading && <div className="loading-spinner">Lädt...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-content">
          <div className="dashboard-left">
            {/* NEU: Nutzt jetzt filteredTodos anstatt todos */}
            <TodoList
              todos={filteredTodos}
              onTodoSelect={handleSelectTodo}
              onTodoUpdate={handleTodoUpdate}
              isInstructor={isInstructor}
            />
          </div>

          <div className="dashboard-right">
            {isInstructor && (
              <div className="instructor-panel">
                <h3>👨‍🏫 Ausbilder-Bereich</h3>
                <button onClick={handleOpenNewTodoForm} className="btn-primary btn-large">
                  ➕ Neue Aufgabe erstellen
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail-Ansicht (Modal oder Sidebar) */}
      {isDetailOpen && selectedTodo && (
        <TodoDetail
          todo={selectedTodo}
          onClose={handleCloseDetail}
          onUpdate={handleTodoUpdate}
        />
      )}

      {/* Formular-Modal für Erstellen/Bearbeiten */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
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