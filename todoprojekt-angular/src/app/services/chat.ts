import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChatMessage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';
  private STORAGE_KEY = 'chat_last_seen';

  // Set of todoIds that have unread messages
  private unreadTodos$ = new BehaviorSubject<Set<number>>(new Set());
  public unreadTodos = this.unreadTodos$.asObservable();

  constructor(private http: HttpClient) {}

  public getMessages(todoId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/todos/${todoId}/messages`);
  }

  public sendMessage(todoId: number, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/todos/${todoId}/messages`, { message }).pipe(
      tap(() => this.markAsRead(todoId))
    );
  }

  // Check if a todo has unread messages (messages newer than last seen)
  public checkUnread(todoId: number, currentUsername: string): void {
    this.getMessages(todoId).subscribe({
      next: (messages) => {
        if (!messages || messages.length === 0) return;
        const lastSeen = this.getLastSeen(todoId);
        const hasUnread = messages.some(m =>
          m.sender !== currentUsername &&
          new Date(m.createdAt).getTime() > lastSeen
        );
        const current = this.unreadTodos$.value;
        if (hasUnread) {
          current.add(todoId);
        } else {
          current.delete(todoId);
        }
        this.unreadTodos$.next(new Set(current));
      }
    });
  }

  public markAsRead(todoId: number): void {
    const stored = this.getStorage();
    stored[todoId] = Date.now();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    const current = this.unreadTodos$.value;
    current.delete(todoId);
    this.unreadTodos$.next(new Set(current));
  }

  private getLastSeen(todoId: number): number {
    return this.getStorage()[todoId] || 0;
  }

  private getStorage(): Record<number, number> {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }
}
