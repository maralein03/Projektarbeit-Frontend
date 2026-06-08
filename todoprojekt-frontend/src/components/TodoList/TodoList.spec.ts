import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoListComponent } from './TodoList';
import { Todo } from '../../types';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let container: HTMLElement;

  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Todo 1',
      description: 'Description 1',
      assignedTo: 'User 1',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Todo 2',
      description: 'Description 2',
      assignedTo: 'User 2',
      status: 'DONE',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-list"></div>';
    container = document.getElementById('test-list')!;
    component = new TodoListComponent();
  });

  it('should initialize the list component', async () => {
    await component.init('#test-list');
    expect(container.querySelector('.todo-list')).toBeTruthy();
  });

  it('should display empty state when no todos', async () => {
    await component.init('#test-list');
    component.setTodos([]);

    const noTodos = container.querySelector('.no-todos');
    expect(noTodos?.textContent).toContain('Keine Aufgaben gefunden');
  });

  it('should render todos', async () => {
    await component.init('#test-list');
    component.setTodos(mockTodos);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const items = container.querySelectorAll('.todo-item-card');
    expect(items.length).toBe(2);
  });

  it('should display todo titles', async () => {
    await component.init('#test-list');
    component.setTodos(mockTodos);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const titles = container.querySelectorAll('.todo-title');
    expect(titles[0]?.textContent).toBe('Todo 1');
    expect(titles[1]?.textContent).toBe('Todo 2');
  });

  it('should trigger select callback on todo selection', async () => {
    await component.init('#test-list');
    const selectCallback = vi.fn();
    component.onTodoSelect(selectCallback);
    component.setTodos(mockTodos);

    await new Promise((resolve) => setTimeout(resolve, 100));

    const selectBtn = container.querySelector('.btn-select') as HTMLButtonElement;
    selectBtn?.click();

    expect(selectCallback).toHaveBeenCalled();
  });

  it('should trigger update callback', async () => {
    await component.init('#test-list');
    const updateCallback = vi.fn();
    component.onTodoUpdate(updateCallback);
    component.setTodos(mockTodos);

    expect(updateCallback).not.toHaveBeenCalled();
  });

  it('should destroy component', () => {
    component.destroy();
    // Should not throw error
    expect(component).toBeTruthy();
  });
});
