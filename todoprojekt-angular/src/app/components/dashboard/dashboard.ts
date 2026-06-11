import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TodoService } from '../../services/todo';
import { KeycloakService } from '../../services/keycloak';
import { Todo } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ChatModal } from '../chat-modal/chat-modal';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ChatModal,
    MatButton,
    MatIcon,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  loading = true;
  error: string | null = null;
  userRoles: string[] = [];
  currentUsername: string = '';
  statusOptions = ['OPEN', 'IN_PROGRESS', 'DONE'];
  chatModalOpen = false;
  activeChatTodo: { id: number; title: string } | null = null;
  private destroy$ = new Subject<void>();
  private lastReloadTime = 0;
  private reloadDebounce = 500;
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private todoService: TodoService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadTodos();
    this.loadUserRoles();
    
    // Listen to router events and reload todos on dashboard navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd && event.urlAfterRedirects.includes('/dashboard')),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const now = Date.now();
        if (now - this.lastReloadTime > this.reloadDebounce) {
          this.lastReloadTime = now;
          // Force reload with a small delay to ensure component is initialized
          setTimeout(() => this.loadTodos(), 100);
        }
      });

    // Listen to todo changes and reload
    this.todoService.todoChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadTodos();
      });
  }

  loadCurrentUser(): void {
    this.keycloakService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          console.log('User object received:', user);
          console.log('preferred_username:', user?.preferred_username);
          console.log('name:', user?.name);
          if (user && (user.username || user.preferred_username)) {
            this.currentUsername = user.username || user.preferred_username;
            this.filterTodos();
          }
        }
      });
  }

  loadTodos(): void {
    console.log('Loading todos...');
    this.loading = true;
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log('Raw response:', response);
          // Handle both ApiResponse<Todo[]> and direct Todo[] array
          const todos = response.data || response;
          console.log('Todos loaded:', JSON.stringify(todos).substring(0, 100));
          this.todos = Array.isArray(todos) ? todos : [];
          console.log('this.todos assigned:', this.todos.length, 'items');
          this.filterTodos();
          this.loading = false;
          this.cdr.markForCheck();
          console.log('Loading complete. Count:', this.todos.length);
        },
        error: (error) => {
          console.error('Error loading todos:', error);
          this.error = 'Failed to load todos';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  filterTodos(): void {
    if (!this.hasRole('ROLE_UPDATE') && this.currentUsername) {
      this.filteredTodos = this.todos.filter(todo =>
        todo.assignedTo === this.currentUsername
      );
    } else {
      this.filteredTodos = this.todos;
    }
  }

  get openTodos(): Todo[] {
    return this.filteredTodos.filter(t => t.status === 'OPEN');
  }

  get inProgressTodos(): Todo[] {
    return this.filteredTodos.filter(t => t.status === 'IN_PROGRESS');
  }

  get doneTodos(): Todo[] {
    return this.filteredTodos.filter(t => t.status === 'DONE');
  }

  updateStatus(todoId: number, newStatus: string): void {
    const status = newStatus as 'OPEN' | 'IN_PROGRESS' | 'DONE';
    this.todoService.updateTodo(todoId, { status })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update local todo
          const todo = this.todos.find(t => t.id === todoId);
          if (todo) {
            todo.status = status;
          }
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Failed to update status');
        }
      });
  }

  loadUserRoles(): void {
    this.keycloakService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          if (user && user.roles) {
            this.userRoles = user.roles;
          }
        },
        error: (error) => {
          console.error('Error loading user roles:', error);
        }
      });
  }

  hasRole(role: string): boolean {
    return this.keycloakService.hasRole(role);
  }

  deleteTodo(id: number): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.todos = this.todos.filter(t => t.id !== id);
          },
          error: (error) => {
            console.error('Error deleting todo:', error);
          }
        });
    }
  }

  openChat(todo: Todo): void {
    this.activeChatTodo = {
      id: todo.id,
      title: todo.title
    };
    this.chatModalOpen = true;
  }

  closeChat(): void {
    this.chatModalOpen = false;
    this.activeChatTodo = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
