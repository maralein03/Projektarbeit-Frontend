export type TodoStatus = 'Open' | 'In Progress' | 'Done' | 'Accepted';

export interface Todo {
  id: number;
  title: string;
  description: string;
  assignTo: string;
  status: TodoStatus;
  createdAt: string;
}

export interface Question {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  todo: Todo;
}

export interface AuthUser {
  username: string;
  email: string;
  roles: string[];
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
