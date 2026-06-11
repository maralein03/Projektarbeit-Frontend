import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo';
import { QuestionService } from '../../services/question';
import { Todo, Question, ApiResponse } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo-detail.html',
  styleUrl: './todo-detail.css'
})
export class TodoDetail implements OnInit, OnDestroy {
  todo: Todo | null = null;
  questions: Question[] = [];
  loading = true;
  error: string | null = null;
  private todoId: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.todoId = +params['id'];
      this.loadTodo();
      this.loadQuestions();
    });
  }

  loadTodo(): void {
    this.todoService.getTodoById(this.todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Todo>) => {
          this.todo = response.data || null;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load todo';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  loadQuestions(): void {
    this.questionService.getQuestionsByTodoId(this.todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Question[]>) => {
          this.questions = response.data || [];
        },
        error: (error) => {
          console.error('Error loading questions:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
