import { apiClient } from './api';
import { Todo, TodoStatus } from '../types';

export const todoService = {
  // Get all todos
  getAllTodos: async (): Promise<Todo[]> => {
    try {
      const response = await apiClient.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get single todo by ID
  getTodoById: async (id: number): Promise<Todo> => {
    try {
      const response = await apiClient.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo ${id}:`, error);
      throw error;
    }
  },

  // Create new todo (ROLE_UPDATE only)
  createTodo: async (todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> => {
    try {
      const response = await apiClient.post('/todos', todo);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id: number, todo: Partial<Todo>): Promise<Todo> => {
    try {
      const response = await apiClient.put(`/todos/${id}`, todo);
      return response.data;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  },

  // Delete todo (ROLE_UPDATE only)
  deleteTodo: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/todos/${id}`);
    } catch (error) {
      console.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  },

  // Change todo status
  updateTodoStatus: async (id: number, status: TodoStatus): Promise<Todo> => {
    try {
      const response = await apiClient.patch(`/todos/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating todo status ${id}:`, error);
      throw error;
    }
  },

  // Accept todo
  acceptTodo: async (id: number): Promise<Todo> => {
    try {
      const response = await apiClient.patch(`/todos/${id}/accept`);
      return response.data;
    } catch (error) {
      console.error(`Error accepting todo ${id}:`, error);
      throw error;
    }
  },
};
