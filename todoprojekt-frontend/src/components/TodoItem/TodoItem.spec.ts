import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoItemComponent } from './TodoItem';
import { Todo } from '../../types';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let container: HTMLElement;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    assignedTo: 'John Doe',
    status: 'OPEN',
    createdAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-item"></div>';
    container = document.getElementById('test-item')!;
    component = new TodoItemComponent();
  });

  it('should initialize the item component', async () => {
    await component.init('#test-item');
    expect(container.querySelector('.todo-item-card')).toBeTruthy();
  });

  it('should render todo data', async () => {
    await component.init('#test-item');
    component.setData(mockTodo);

    const title = container.querySelector('#todoTitle');
    const description = container.querySelector('#todoDescription');
    const assignedTo = container.querySelector('#assignedTo');

    expect(title?.textContent).toBe('Test Todo');
    expect(description?.textContent).toBe('Test Description');
    expect(assignedTo?.textContent).toBe('John Doe');
  });

  it('should display correct status badge', async () => {
    await component.init('#test-item');
    component.setData(mockTodo);

    const badge = container.querySelector('#statusBadge');
    expect(badge?.textContent).toBe('Offen');
    expect(badge?.classList.contains('open')).toBe(true);
  });

  it('should show status button only for instructors', async () => {
    await component.init('#test-item');
    component.setData(mockTodo, true);

    const statusContainer = container.querySelector('#statusContainer') as HTMLElement;
    expect(statusContainer?.style.display).not.toBe('none');
  });

  it('should hide status button for non-instructors', async () => {
    await component.init('#test-item');
    component.setData(mockTodo, false);

    const statusContainer = container.querySelector('#statusContainer') as HTMLElement;
    expect(statusContainer?.style.display).toBe('none');
  });

  it('should trigger select callback', async () => {
    await component.init('#test-item');
    const selectCallback = vi.fn();
    component.onSelect(selectCallback);
    component.setData(mockTodo);

    const selectBtn = container.querySelector('#selectBtn') as HTMLButtonElement;
    selectBtn?.click();

    expect(selectCallback).toHaveBeenCalled();
  });

  it('should format date correctly', async () => {
    await component.init('#test-item');
    component.setData(mockTodo);

    const createdAt = container.querySelector('#createdAt');
    expect(createdAt?.textContent).toBeTruthy();
    expect(createdAt?.textContent).toContain('1.1.2024');
  });

  it('should destroy component', () => {
    component.destroy();
    expect(component).toBeTruthy();
  });

  it('should display different status badges for different statuses', async () => {
    await component.init('#test-item');
    
    const doneTodo = { ...mockTodo, status: 'DONE' as const };
    component.setData(doneTodo);

    const badge = container.querySelector('#statusBadge');
    expect(badge?.textContent).toBe('Erledigt');
    expect(badge?.classList.contains('done')).toBe(true);
  });
});
