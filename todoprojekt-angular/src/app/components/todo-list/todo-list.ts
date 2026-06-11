import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from '../../services/todo';
import { Todo, ApiResponse } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HighlightStatus } from '../../directives/highlight-status';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HighlightStatus],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoList implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  loading = true;
  error: string | null = null;
  filterStatus: string = 'ALL';
  private destroy$ = new Subject<void>();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Todo[]>) => {
          this.todos = response.data || [];
          this.applyFilter();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load todos';
          this.loading = false;
          console.error('Error:', error);
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
