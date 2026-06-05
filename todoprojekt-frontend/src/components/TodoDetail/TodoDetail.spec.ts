import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoDetailComponent } from './TodoDetail';
import { Todo } from '../../types';

describe('TodoDetailComponent', () => {
  let component: TodoDetailComponent;
  let container: HTMLElement;

  const mockTodo: Todo = {
    id: 1,
    title: 'Detail Todo',
    description: 'This is a detail todo',
    assignedTo: 'Jane Smith',
    status: 'IN_PROGRESS',
    createdAt: '2024-01-15T00:00:00Z',
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-detail"></div>';
    container = document.getElementById('test-detail')!;
    component = new TodoDetailComponent();
  });

  it('should initialize the detail component', async () => {
    await component.init('#test-detail');
    expect(container.querySelector('.todo-detail-overlay')).toBeTruthy();
  });

  it('should display todo details when shown', async () => {
    await component.init('#test-detail');
    await component.show(mockTodo);

    const title = container.querySelector('#detailTitle');
    const description = container.querySelector('#detailDescription');

    expect(title?.textContent).toBe('Detail Todo');
    expect(description?.textContent).toBe('This is a detail todo');
  });

  it('should show overlay when displaying detail', async () => {
    await component.init('#test-detail');
    await component.show(mockTodo);

    const overlay = container.querySelector('.todo-detail-overlay');
    expect((overlay as HTMLElement).style.display).toBe('flex');
  });

  it('should hide overlay when closing', async () => {
    await component.init('#test-detail');
    await component.show(mockTodo);
    component.hide();

    const overlay = container.querySelector('.todo-detail-overlay');
    expect((overlay as HTMLElement).style.display).toBe('none');
  });

  it('should trigger close callback', async () => {
    await component.init('#test-detail');
    const closeCallback = vi.fn();
    component.onClose(closeCallback);

    await component.show(mockTodo);

    const closeBtn = container.querySelector('#closeBtn') as HTMLButtonElement;
    closeBtn?.click();

    expect(closeCallback).toHaveBeenCalled();
  });

  it('should display correct status badge', async () => {
    await component.init('#test-detail');
    await component.show(mockTodo);

    const statusBadge = container.querySelector('#detailStatus');
    expect(statusBadge?.textContent).toBe('In Arbeit');
    expect(statusBadge?.classList.contains('in-progress')).toBe(true);
  });

  it('should display assigned user', async () => {
    await component.init('#test-detail');
    await component.show(mockTodo);

    const assignedTo = container.querySelector('#detailAssignedTo');
    expect(assignedTo?.textContent).toBe('Jane Smith');
  });

  it('should format creation date', async () => {
    await component.init('#test-detail');
    await component.show(mockTodo);

    const createdAt = container.querySelector('#detailCreatedAt');
    expect(createdAt?.textContent).toContain('15.1.2024');
  });

  it('should close on overlay click', async () => {
    await component.init('#test-detail');
    const closeCallback = vi.fn();
    component.onClose(closeCallback);

    await component.show(mockTodo);

    const overlay = container.querySelector('.todo-detail-overlay') as HTMLElement;
    overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(closeCallback).toHaveBeenCalled();
  });

  it('should destroy component', () => {
    component.destroy();
    expect(component).toBeTruthy();
  });
});
