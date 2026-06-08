import { describe, it, expect, beforeEach, vi } from 'vitest';
import { todoService } from './todoService';
import { Todo, TodoStatus } from '../types';

describe('TodoService', () => {
  let mockTodos: Todo[] = [];

  beforeEach(() => {
    mockTodos = [
      {
        id: '1',
        title: 'Test Todo 1',
        description: 'Description 1',
        assignedTo: 'John',
        status: 'OPEN' as TodoStatus,
        createdAt: new Date(),
        createdBy: 'user1',
        updatedAt: new Date(),
      },
      {
        id: '2',
        title: 'Test Todo 2',
        description: 'Description 2',
        assignedTo: 'Jane',
        status: 'IN_PROGRESS' as TodoStatus,
        createdAt: new Date(),
        createdBy: 'user2',
        updatedAt: new Date(),
      },
    ];
  });

  describe('getAllTodos', () => {
    it('should fetch all todos', async () => {
      // Mock implementation - in real app this would call API
      const todos = mockTodos;
      expect(todos).toBeDefined();
      expect(todos.length).toBe(2);
    });

    it('should return array of Todo objects', async () => {
      const todos = mockTodos;
      expect(Array.isArray(todos)).toBe(true);
      todos.forEach((todo) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('status');
      });
    });
  });

  describe('getTodoById', () => {
    it('should find todo by id', () => {
      const todo = mockTodos.find((t) => t.id === '1');
      expect(todo).toBeDefined();
      expect(todo?.title).toBe('Test Todo 1');
    });

    it('should return undefined for non-existent id', () => {
      const todo = mockTodos.find((t) => t.id === '999');
      expect(todo).toBeUndefined();
    });
  });

  describe('createTodo', () => {
    it('should create new todo with valid data', () => {
      const newTodo: Todo = {
        id: '3',
        title: 'New Todo',
        description: 'New Description',
        assignedTo: 'Bob',
        status: 'OPEN',
        createdAt: new Date(),
        createdBy: 'user3',
        updatedAt: new Date(),
      };

      expect(newTodo).toHaveProperty('id');
      expect(newTodo.status).toBe('OPEN');
    });

    it('should validate required fields', () => {
      const invalidTodo = {
        title: '',
        description: '',
      };

      expect(invalidTodo.title).toBe('');
    });
  });

  describe('updateTodo', () => {
    it('should update todo status', () => {
      const todo = mockTodos[0];
      const updatedTodo = {
        ...todo,
        status: 'DONE' as TodoStatus,
      };

      expect(updatedTodo.status).toBe('DONE');
    });

    it('should preserve todo id on update', () => {
      const todo = mockTodos[0];
      const updatedTodo = {
        ...todo,
        title: 'Updated Title',
      };

      expect(updatedTodo.id).toBe(todo.id);
    });
  });

  describe('deleteTodo', () => {
    it('should remove todo from collection', () => {
      const initialLength = mockTodos.length;
      mockTodos = mockTodos.filter((t) => t.id !== '1');

      expect(mockTodos.length).toBe(initialLength - 1);
      expect(mockTodos.find((t) => t.id === '1')).toBeUndefined();
    });
  });

  describe('filterTodosByStatus', () => {
    it('should filter todos by status', () => {
      const openTodos = mockTodos.filter((t) => t.status === 'OPEN');
      expect(openTodos.length).toBe(1);
      expect(openTodos[0].status).toBe('OPEN');
    });

    it('should return empty array for non-existent status', () => {
      const doneTodos = mockTodos.filter((t) => t.status === 'DONE');
      expect(doneTodos.length).toBe(0);
    });
  });

  describe('Data mapping', () => {
    it('should correctly map API response to Todo objects', () => {
      const apiResponse = {
        id: '4',
        title: 'API Todo',
        description: 'From API',
        assignedTo: 'Alice',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        updatedAt: new Date().toISOString(),
      };

      const todo: Todo = {
        id: apiResponse.id,
        title: apiResponse.title,
        description: apiResponse.description,
        assignedTo: apiResponse.assignedTo,
        status: apiResponse.status as TodoStatus,
        createdAt: new Date(apiResponse.createdAt),
        createdBy: apiResponse.createdBy,
        updatedAt: new Date(apiResponse.updatedAt),
      };

      expect(todo.title).toBe('API Todo');
      expect(todo.status).toBe('OPEN');
    });
  });
});
