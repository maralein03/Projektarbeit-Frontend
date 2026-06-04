import React, { useState } from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import '../styles/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onTodoSelect: (todo: Todo) => void;
  onTodoUpdate: (todo: Todo) => void;
  isInstructor: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onTodoSelect,
  onTodoUpdate,
  isInstructor,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === 'All') return true;
    return todo.status === filterStatus;
  });

  const statuses = ['All', 'Open', 'In Progress', 'Done', 'Accepted'];

  return (
    <div className="todo-list">
      <div className="list-header">
        <h2>📋 Meine Aufgaben</h2>
        <div className="filter-buttons">
          {statuses.map((status) => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? '🔄 Alle' : status}
            </button>
          ))}
        </div>
      </div>

      <div className="todos-container">
        {filteredTodos.length === 0 ? (
          <div className="no-todos">
            <p>Keine Aufgaben gefunden</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onTodoUpdate}
              onSelect={onTodoSelect}
              isInstructor={isInstructor}
            />
          ))
        )}
      </div>
    </div>
  );
};
