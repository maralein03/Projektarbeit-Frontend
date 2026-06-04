import { useEffect, useState } from 'react';
import { Todo } from '../types';
import { todoService } from '../services/todoService';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, isLoading, error, fetchTodos };
};

export const useTodo = (id: number) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await todoService.getTodoById(id);
        setTodo(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todo';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTodo();
    }
  }, [id]);

  return { todo, isLoading, error };
};
