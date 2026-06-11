import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { vi } from 'vitest';

import { TodoForm } from './todo-form';
import { TodoService } from '../../services/todo';
import { ApiResponse, Todo } from '../../models';

interface TodoServiceMock {
  createTodo: ReturnType<typeof vi.fn>;
}

describe('TodoForm', () => {
  let component: TodoForm;
  let fixture: ComponentFixture<TodoForm>;
  let todoServiceMock: TodoServiceMock;
  let router: Router;

  beforeEach(async () => {
    todoServiceMock = {
      createTodo: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TodoForm],
      providers: [
        provideRouter([]),
        { provide: TodoService, useValue: todoServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoForm);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise an invalid form with status OPEN as default value', () => {
    expect(component.todoForm).toBeDefined();
    expect(component.todoForm.invalid).toBe(true);
    expect(component.todoForm.get('status')?.value).toBe('OPEN');
  });

  it('title should be required and validate minLength/maxLength', () => {
    const title = component.todoForm.get('title')!;

    title.setValue('');
    expect(title.errors?.['required']).toBeTruthy();

    title.setValue('ab');
    expect(title.errors?.['minlength']).toBeTruthy();

    title.setValue('a'.repeat(101));
    expect(title.errors?.['maxlength']).toBeTruthy();

    title.setValue('Gültiger Titel');
    expect(title.valid).toBe(true);
  });

  it('description should be required and validate minLength/maxLength', () => {
    const desc = component.todoForm.get('description')!;

    desc.setValue('');
    expect(desc.errors?.['required']).toBeTruthy();

    desc.setValue('abcd');
    expect(desc.errors?.['minlength']).toBeTruthy();

    desc.setValue('a'.repeat(201));
    expect(desc.errors?.['maxlength']).toBeTruthy();

    desc.setValue('Gültige Beschreibung');
    expect(desc.valid).toBe(true);
  });

  it('assignedTo should be required', () => {
    const assigned = component.todoForm.get('assignedTo')!;
    expect(assigned.errors?.['required']).toBeTruthy();

    assigned.setValue('lernender');
    expect(assigned.valid).toBe(true);
  });

  it('onSubmit() should not call the service when the form is invalid', () => {
    component.onSubmit();
    expect(todoServiceMock.createTodo).not.toHaveBeenCalled();
    expect(component.error).toBe('Please fill in all required fields');
  });

  it('onSubmit() should call createTodo and navigate after success', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const mockResponse: ApiResponse<Todo> = {
      data: {
        id: 1,
        title: 'Test',
        description: 'Beschreibung',
        status: 'OPEN',
        createdAt: '',
        updatedAt: '',
        assignedTo: 'lernender'
      },
      message: 'Created',
      status: 201
    };
    todoServiceMock.createTodo.mockReturnValue(of(mockResponse));

    component.todoForm.setValue({
      title: 'Test Titel',
      description: 'Beschreibung lang genug',
      status: 'OPEN',
      assignedTo: 'lernender'
    });

    component.onSubmit();

    expect(todoServiceMock.createTodo).toHaveBeenCalledWith({
      title: 'Test Titel',
      description: 'Beschreibung lang genug',
      status: 'OPEN',
      assignedTo: 'lernender'
    });
    expect(component.success).toBe(true);
    expect(component.submitting).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(
      ['/todos'],
      { state: { toast: 'Aufgabe "Test Titel" erfolgreich erstellt' } }
    );
  });

  it('onSubmit() should set error message on service failure', () => {
    todoServiceMock.createTodo.mockReturnValue(
      throwError(() => new Error('boom')) as Observable<ApiResponse<Todo>>
    );

    component.todoForm.setValue({
      title: 'Test Titel',
      description: 'Beschreibung lang genug',
      status: 'OPEN',
      assignedTo: 'lernender'
    });

    component.onSubmit();

    expect(component.error).toBe('Failed to create todo');
    expect(component.submitting).toBe(false);
    expect(component.success).toBe(false);
  });
});
