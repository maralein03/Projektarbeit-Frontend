import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo';
import { ApiResponse } from '../../models';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css'
})
export class TodoForm implements OnInit {
  todoForm: FormGroup;
  submitting = false;
  error: string | null = null;
  success = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private router: Router
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      status: ['OPEN', Validators.required],
      assignedTo: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.submitting = true;
    this.error = null;

    this.todoService.createTodo({
      title: this.todoForm.get('title')?.value,
      description: this.todoForm.get('description')?.value,
      status: this.todoForm.get('status')?.value || 'OPEN',
      assignedTo: this.todoForm.get('assignedTo')?.value
    }).subscribe({
      next: (_response: ApiResponse<any>) => {
        this.success = true;
        this.submitting = false;
        const title = this.todoForm.get('title')?.value;
        this.router.navigate(['/todos'], {
          state: { toast: `Aufgabe "${title}" erfolgreich erstellt` }
        });
      },
      error: (error) => {
        this.error = 'Failed to create todo';
        this.submitting = false;
        console.error('Error:', error);
      }
    });
  }
}
