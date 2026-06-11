import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Todo, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = environment.apiUrl + '/todos';
  
  // ReplaySubject with buffer of 1 to notify about todo changes
  // This ensures late subscribers still get notified
  public todoChanged$ = new ReplaySubject<void>(1);

  constructor(private http: HttpClient) { }

  public getTodos(): Observable<ApiResponse<Todo[]>> {
    return this.http.get<ApiResponse<Todo[]>>(this.apiUrl);
  }

  public getTodoById(id: number): Observable<ApiResponse<Todo>> {
    return this.http.get<ApiResponse<Todo>>(`${this.apiUrl}/${id}`);
  }

  public createTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Todo>> {
    return this.http.post<ApiResponse<Todo>>(this.apiUrl, todo).pipe(
      tap(() => this.todoChanged$.next())
    );
  }

  public updateTodo(id: number, todo: Partial<Todo>): Observable<ApiResponse<Todo>> {
    return this.http.patch<ApiResponse<Todo>>(`${this.apiUrl}/${id}`, todo).pipe(
      tap(() => this.todoChanged$.next())
    );
  }

  public changeStatus(id: number, status: string): Observable<ApiResponse<Todo>> {
    return this.http.patch<ApiResponse<Todo>>(`${this.apiUrl}/${id}/status?status=${status}`, null).pipe(
      tap(() => this.todoChanged$.next())
    );
  }

  public deleteTodo(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.todoChanged$.next())
    );
  }
}
