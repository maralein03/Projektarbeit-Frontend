import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Question, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.apiUrl + '/questions';

  constructor(private http: HttpClient) { }

  public getQuestionsByTodoId(todoId: number): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.apiUrl}?todoId=${todoId}`);
  }

  public createQuestion(question: Omit<Question, 'id' | 'createdAt' | 'resolved'>): Observable<ApiResponse<Question>> {
    return this.http.post<ApiResponse<Question>>(this.apiUrl, question);
  }

  public updateQuestion(id: number, question: Partial<Question>): Observable<ApiResponse<Question>> {
    return this.http.patch<ApiResponse<Question>>(`${this.apiUrl}/${id}`, question);
  }

  public deleteQuestion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
