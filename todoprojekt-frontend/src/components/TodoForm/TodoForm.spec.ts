import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TodoFormComponent, TodoFormData } from './TodoForm';
import { Todo } from '../../types';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-form"></div>';
    container = document.getElementById('test-form')!;
    component = new TodoFormComponent();
  });

  it('should initialize the form component', async () => {
    await component.init('#test-form');
    expect(container.querySelector('.todo-form')).toBeTruthy();
  });

  it('should render form title for new todo', async () => {
    await component.init('#test-form');
    const title = container.querySelector('#formTitle');
    expect(title?.textContent).toBe('✨ Neue Todo erstellen');
  });

  it('should submit form with valid data', async () => {
    await component.init('#test-form');
    const submitCallback = vi.fn();
    component.onSubmit(submitCallback);

    const titleInput = container.querySelector('#titleInput') as HTMLInputElement;
    const assignedToInput = container.querySelector('#assignedToInput') as HTMLInputElement;
    const descriptionInput = container.querySelector('#descriptionInput') as HTMLTextAreaElement;

    titleInput.value = 'Test Todo';
    assignedToInput.value = 'John Doe';
    descriptionInput.value = 'Test Description';

    const form = container.querySelector('#todoForm') as HTMLFormElement;
    form?.dispatchEvent(new Event('submit', { bubbles: true }));

    expect(submitCallback).toHaveBeenCalled();
    expect(submitCallback.mock.calls[0][0].title).toBe('Test Todo');
  });

  it('should prevent submission without required fields', async () => {
    await component.init('#test-form');
    const submitCallback = vi.fn();
    component.onSubmit(submitCallback);

    const form = container.querySelector('#todoForm') as HTMLFormElement;
    form?.dispatchEvent(new Event('submit', { bubbles: true }));

    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('should handle cancel button', async () => {
    await component.init('#test-form');
    const cancelCallback = vi.fn();
    component.onCancel(cancelCallback);

    const cancelBtn = container.querySelector('#cancelBtn') as HTMLButtonElement;
    cancelBtn?.click();

    expect(cancelCallback).toHaveBeenCalled();
  });

  it('should reset form', async () => {
    await component.init('#test-form');
    const titleInput = container.querySelector('#titleInput') as HTMLInputElement;
    titleInput.value = 'Test';

    component.reset();

    expect(titleInput.value).toBe('');
    expect(component.getIsNew()).toBe(true);
  });

  it('should load existing todo for editing', async () => {
    await component.init('#test-form');
    
    const mockTodo: Todo = {
      id: 1,
      title: 'Existing Todo',
      description: 'Description',
      assignedTo: 'Jane',
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
    };

    component.loadTodo(mockTodo);

    const titleInput = container.querySelector('#titleInput') as HTMLInputElement;
    expect(titleInput.value).toBe('Existing Todo');
    expect(component.getIsNew()).toBe(false);
  });

  it('should display edit title when editing', async () => {
    await component.init('#test-form');
    
    const mockTodo: Todo = {
      id: 1,
      title: 'Test',
      description: '',
      assignedTo: 'Jane',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    component.loadTodo(mockTodo);

    const title = container.querySelector('#formTitle');
    expect(title?.textContent).toBe('📝 Aufgabe bearbeiten');
  });
});
