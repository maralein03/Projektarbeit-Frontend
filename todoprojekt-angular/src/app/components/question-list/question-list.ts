import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../services/question';
import { Question, ApiResponse } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-list.html',
  styleUrl: './question-list.css'
})
export class QuestionList implements OnInit, OnDestroy {
  questions: Question[] = [];
  loading = true;
  error: string | null = null;
  newQuestion = '';
  submitting = false;
  private todoId: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.todoId = +params['todoId'];
      this.loadQuestions();
    });
  }

  loadQuestions(): void {
    this.questionService.getQuestionsByTodoId(this.todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Question[]>) => {
          this.questions = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load questions';
          this.loading = false;
          console.error('Error:', error);
        }
      });
  }

  addQuestion(): void {
    if (!this.newQuestion.trim()) {
      this.error = 'Frage kann nicht leer sein';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.questionService.createQuestion({
      todoId: this.todoId,
      content: this.newQuestion,
      author: 'Current User'
    }).subscribe({
      next: (response: ApiResponse<Question>) => {
        if (response.data) {
          this.questions.push(response.data);
          this.newQuestion = '';
        }
        this.submitting = false;
      },
      error: (error) => {
        this.error = 'Failed to add question';
        this.submitting = false;
        console.error('Error:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
