import { apiClient } from './api';
import { Question } from '../types';

export const questionService = {
  // Get all questions for a todo
  getQuestionsByTodoId: async (todoId: number): Promise<Question[]> => {
    try {
      const response = await apiClient.get(`/todos/${todoId}/questions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching questions for todo ${todoId}:`, error);
      throw error;
    }
  },

  // Create a new question (comment/chat)
  createQuestion: async (
    todoId: number,
    content: string,
    author: string
  ): Promise<Question> => {
    try {
      const response = await apiClient.post(`/todos/${todoId}/questions`, {
        content,
        author,
      });
      return response.data;
    } catch (error) {
      console.error(`Error creating question for todo ${todoId}:`, error);
      throw error;
    }
  },
};
