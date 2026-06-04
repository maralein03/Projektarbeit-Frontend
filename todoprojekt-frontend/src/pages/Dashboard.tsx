import React, { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { TodoDetail } from '../components/TodoDetail';
import { Todo } from '../types';
import '../styles/Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { todos, isLoading, error, fetchTodos } = useTodos();
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewTodo, setIsNewTodo] = useState(false);

  const isInstructor = hasRole('ROLE_UPDATE');

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDetailOpen(true);
  };

  const handleOpenNewTodoForm = () => {
    setSelectedTodo(null);
    setIsNewTodo(true);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (todo: Todo) => {
    await fetchTodos();
    setIsFormOpen(false);
    setIsNewTodo(false);
  };

  const handleTodoUpdate = async (todo: Todo) => {
    await fetchTodos();
    if (selectedTodo?.id === todo.id) {
      setSelectedTodo(todo);
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

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-main">
        {isLoading && <div className="loading-spinner">Lädt...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-content">
          <div className="dashboard-left">
            <TodoList
              todos={todos}
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

      {isDetailOpen && selectedTodo && (
        <TodoDetail
          todo={selectedTodo}
          onClose={handleCloseDetail}
          onUpdate={handleTodoUpdate}
        />
      )}

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
