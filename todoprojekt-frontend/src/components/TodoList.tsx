import React from 'react';
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
  // HINWEIS: Der lokale filterStatus und das Filtern wurden entfernt,
  // da das Dashboard jetzt bereits die fertig gefilterten To-Dos übergibt!

  return (
    <div className="todo-list">
      <div className="list-header">
        <h2>📋 Meine Aufgaben</h2>
        {/* Die komplette "filter-buttons" Div-Box wurde hier entfernt */}
      </div>

      <div className="todos-container">
        {todos.length === 0 ? (
          <div className="no-todos">
            <p>Keine Aufgaben gefunden</p>
          </div>
        ) : (
          todos.map((todo) => (
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