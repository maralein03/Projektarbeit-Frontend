import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TodoService } from '../../services/todo';
import { KeycloakService } from '../../services/keycloak';
import { ChatService } from '../../services/chat';
import { Todo } from '../../models';
import { Subject, interval } from 'rxjs';
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
  toastMessage: string | null = null;
  toastType: 'success' | 'error' = 'success';
  private toastTimer: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private keycloakService: KeycloakService,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router
  ) {
    // Pick up toast message passed from another route (e.g. todo creation)
    const nav = this.router.getCurrentNavigation();
    const toast = nav?.extras?.state?.['toast'];
    if (toast) {
      // Defer until view is ready
      setTimeout(() => this.showToast(toast, 'success'), 0);
    }
  }

  ngOnInit(): void {
    this.keycloakService.getUser().pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) this.currentUsername = user.username || user.preferred_username || '';
    });
    this.chatService.unreadTodos.pipe(takeUntil(this.destroy$)).subscribe(ids => {
      this.zone.run(() => {
        this.unreadTodoIds = ids;
        this.cdr.markForCheck();
      });
    });
    this.loadTodos();
    // Poll for new unread chat messages every 5 seconds
    interval(5000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.todos.forEach(todo => this.chatService.checkUnread(todo.id, this.currentUsername));
    });
  }

  loadTodos(): void {
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.zone.run(() => {
            const todos = response.data || response;
            this.todos = Array.isArray(todos) ? todos : [];
            this.applyFilter();
            this.loading = false;
            this.cdr.markForCheck();
            // Check unread messages for all todos
            this.todos.forEach(todo => this.chatService.checkUnread(todo.id, this.currentUsername));
          });
        },
        error: (error) => {
          this.zone.run(() => {
            this.error = 'Failed to load todos';
            this.loading = false;
            this.cdr.markForCheck();
          });
          console.error('Error loading todos:', error);
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
          this.zone.run(() => {
            todo.status = newStatus as any;
            this.applyFilter();
            this.showToast(`Status erfolgreich auf "${this.getStatusLabel(newStatus)}" geändert`, 'success');
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Status update failed:', err);
          this.zone.run(() => {
            this.showToast('Status konnte nicht geändert werden', 'error');
            this.cdr.markForCheck();
          });
        }
      });
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN': return 'Offen';
      case 'IN_PROGRESS': return 'In Bearbeitung';
      case 'DONE': return 'Erledigt';
      default: return status;
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.zone.run(() => {
        this.toastMessage = null;
        this.cdr.markForCheck();
      });
    }, 3000);
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
