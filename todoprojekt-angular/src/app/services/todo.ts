import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todo, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl + '/todos';

  constructor(private http: HttpClient) { }

  public getTodos(): Observable<ApiResponse<Todo[]>> {
    return this.http.get<ApiResponse<Todo[]>>(this.apiUrl);
  }

  public getTodoById(id: number): Observable<ApiResponse<Todo>> {
    return this.http.get<ApiResponse<Todo>>(`${this.apiUrl}/${id}`);
  }

  public createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Todo>> {
    return this.http.post<ApiResponse<Todo>>(this.apiUrl, todo);
  }

  public updateTodo(id: number, todo: Partial<Todo>): Observable<ApiResponse<Todo>> {
    return this.http.patch<ApiResponse<Todo>>(`${this.apiUrl}/${id}`, todo);
  }

  public deleteTodo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
