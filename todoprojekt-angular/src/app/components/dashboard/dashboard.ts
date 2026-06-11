import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from '../../services/todo';
import { KeycloakService } from '../../services/keycloak';
import { Todo, ApiResponse } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HighlightStatus } from '../../directives/highlight-status';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HighlightStatus],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  todos: Todo[] = [];
  loading = true;
  error: string | null = null;
  userRoles: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loadTodos();
    this.loadUserRoles();
  }

  loadTodos(): void {
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Todo[]>) => {
          this.todos = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load todos';
          this.loading = false;
          console.error('Error loading todos:', error);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
