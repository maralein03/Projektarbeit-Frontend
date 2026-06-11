import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { TodoService } from './todo';
import { Todo, ApiResponse } from '../models';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl + '/todos';

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Aufgabe',
    description: 'Beschreibung',
    status: 'OPEN',
    createdAt: '2025-01-01T10:00:00',
    updatedAt: '2025-01-01T10:00:00',
    assignedTo: 'lernender'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTodos() should perform a GET and return the list of todos', () => {
    const mockResponse: ApiResponse<Todo[]> = {
      data: [mockTodo],
      message: 'OK',
      status: 200
    };

    service.getTodos().subscribe(response => {
      expect(response.data?.length).toBe(1);
      expect(response.data?.[0].title).toBe('Test Aufgabe');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getTodoById() should perform a GET with the ID in the URL', () => {
    const mockResponse: ApiResponse<Todo> = {
      data: mockTodo,
      message: 'OK',
      status: 200
    };

    service.getTodoById(1).subscribe(response => {
      expect(response.data?.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('createTodo() should POST and notify todoChanged$', () => {
    const newTodo = {
      title: 'Neu',
      description: 'Neue Beschreibung',
      status: 'OPEN' as const,
      assignedTo: 'lernender'
    };
    const mockResponse: ApiResponse<Todo> = {
      data: mockTodo,
      message: 'Created',
      status: 201
    };

    let notified = false;
    service.todoChanged$.subscribe(() => {
      notified = true;
    });

    service.createTodo(newTodo).subscribe(response => {
      expect(response.data?.title).toBe('Test Aufgabe');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush(mockResponse);

    expect(notified).toBe(true);
  });

  it('updateTodo() should send PATCH with the ID', () => {
    const update = { title: 'Geändert' };
    const mockResponse: ApiResponse<Todo> = {
      data: { ...mockTodo, title: 'Geändert' },
      message: 'OK',
      status: 200
    };

    service.updateTodo(1, update).subscribe(response => {
      expect(response.data?.title).toBe('Geändert');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(update);
    req.flush(mockResponse);
  });

  it('changeStatus() should send PATCH with status as query parameter', () => {
    const mockResponse: ApiResponse<Todo> = {
      data: { ...mockTodo, status: 'DONE' },
      message: 'OK',
      status: 200
    };

    service.changeStatus(1, 'DONE').subscribe(response => {
      expect(response.data?.status).toBe('DONE');
    });

    const req = httpMock.expectOne(`${apiUrl}/1/status?status=DONE`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('deleteTodo() should send DELETE with the ID', () => {
    const mockResponse: ApiResponse<void> = {
      message: 'Deleted',
      status: 200
    };

    service.deleteTodo(1).subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should propagate HTTP errors', () => {
    let errorReceived: { status: number } | undefined;

    service.getTodos().subscribe({
      next: () => {
        throw new Error('expected error');
      },
      error: (err: { status: number }) => {
        errorReceived = err;
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived).toBeTruthy();
    expect(errorReceived?.status).toBe(500);
  });
});
