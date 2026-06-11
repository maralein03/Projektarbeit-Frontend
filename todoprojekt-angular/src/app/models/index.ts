export interface Todo {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
}

export interface Question {
  id: number;
  todoId: number;
  content: string;
  author: string;
  createdAt: string;
  resolved: boolean;
}

export interface ChatMessage {
  id: number;
  todoId: number;
  sender: string;
  message: string;
  createdAt: string;
}

export interface User {
  username: string;
  email: string;
  roles: string[];
  id: string;
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  status: number;
}
