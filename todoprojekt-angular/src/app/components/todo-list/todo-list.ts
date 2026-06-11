import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from '../../services/todo';
import { KeycloakService } from '../../services/keycloak';
import { ChatService } from '../../services/chat';
import { Todo } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatModal } from '../chat-modal/chat-modal';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatModal],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoList implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  loading = true;
  error: string | null = null;
  filterStatus: string = 'ALL';
  chatModalOpen = false;
  activeChatTodo: { id: number; title: string } | null = null;
  unreadTodoIds: Set<number> = new Set();
  currentUsername: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private keycloakService: KeycloakService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.keycloakService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) this.currentUsername = user.username || user.preferred_username || '';
    });
    this.chatService.unreadTodos.pipe(takeUntil(this.destroy$)).subscribe(ids => {
      this.unreadTodoIds = ids;
    });
    this.loadTodos();
  }

  loadTodos(): void {
    console.log('[TodoList] loadTodos() called');
    const t0 = performance.now();
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(`[TodoList] response received in ${(performance.now() - t0).toFixed(0)}ms`, response);
          const todos = response.data || response;
          this.todos = Array.isArray(todos) ? todos : [];
          this.applyFilter();
          this.loading = false;
          console.log('[TodoList] loading=false, count=', this.todos.length);
          // Check unread messages for all todos
          this.todos.forEach(todo => this.chatService.checkUnread(todo.id, this.currentUsername));
        },
        error: (error) => {
          console.error('[TodoList] error:', error);
          this.error = 'Failed to load todos';
          this.loading = false;
        }
      });
  }

  get openTodos(): Todo[] { return this.filteredTodos.filter(t => t.status === 'OPEN'); }
  get inProgressTodos(): Todo[] { return this.filteredTodos.filter(t => t.status === 'IN_PROGRESS'); }
  get doneTodos(): Todo[] { return this.filteredTodos.filter(t => t.status === 'DONE'); }

  hasRole(role: string): boolean { return this.keycloakService.hasRole(role); }

  openChat(todo: Todo): void {
    this.activeChatTodo = { id: todo.id, title: todo.title };
    this.chatModalOpen = true;
    this.chatService.markAsRead(todo.id);
  }

  closeChat(): void {
    this.chatModalOpen = false;
    this.activeChatTodo = null;
  }

  updateStatus(todo: Todo, newStatus: string): void {
    this.todoService.changeStatus(todo.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          todo.status = newStatus as any;
          this.applyFilter();
        },
        error: (err) => {
          console.error('Status update failed:', err);
          alert('Status konnte nicht geändert werden');
        }
      });
  }

  applyFilter(): void {
    if (this.filterStatus === 'ALL') {
      this.filteredTodos = this.todos;
    } else {
      this.filteredTodos = this.todos.filter(t => t.status === this.filterStatus);
    }
  }

  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
