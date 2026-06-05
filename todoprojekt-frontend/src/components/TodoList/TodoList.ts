import { Todo } from '../../types';
import { TodoItemComponent } from '../TodoItem/TodoItem';

const TEMPLATE = `
<div class="todo-list">
  <div class="list-header">
    <h2>📋 Meine Aufgaben</h2>
  </div>

  <div class="todos-container" id="todosContainer">
    <div class="no-todos">
      <p>Keine Aufgaben gefunden</p>
    </div>
  </div>
</div>
`;

export class TodoListComponent {
  private container: HTMLElement | null;
  private todosContainer: HTMLElement | null;
  private todos: Todo[] = [];
  private todoItems: Map<number, TodoItemComponent> = new Map();
  private selectCallback: ((todo: Todo) => void) | null = null;
  private updateCallback: ((todo: Todo) => void) | null = null;
  private isInstructor: boolean = false;

  constructor() {
    this.container = null;
    this.todosContainer = null;
  }

  /**
   * Initialisiert die TodoList-Komponente
   */
  async init(parentSelector: string): Promise<void> {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      throw new Error(`Parent element ${parentSelector} not found`);
    }

    parent.innerHTML = TEMPLATE;
    this.container = parent.querySelector('.todo-list') as HTMLElement;
    this.todosContainer = parent.querySelector('#todosContainer') as HTMLElement;

    if (!this.container || !this.todosContainer) {
      throw new Error('TodoList elements not found in template');
    }
  }

  /**
   * Setzt die TodoList-Daten und rendert sie
   */
  setTodos(todos: Todo[], isInstructor: boolean = false): void {
    this.todos = todos;
    this.isInstructor = isInstructor;
    this.render();
  }

  /**
   * Rendert die Todo-Liste
   */
  private async render(): Promise<void> {
    if (!this.todosContainer) return;

    if (this.todos.length === 0) {
      this.todosContainer.innerHTML = `
        <div class="no-todos">
          <p>Keine Aufgaben gefunden</p>
        </div>
      `;
      return;
    }

    // Alte TodoItems aufräumen
    this.todoItems.forEach((item) => {
      item.destroy();
    });
    this.todoItems.clear();

    // Container leeren
    this.todosContainer.innerHTML = '';

    // Neue TodoItems erstellen
    for (const todo of this.todos) {
      const itemContainer = document.createElement('div');
      itemContainer.id = `todo-item-${todo.id}`;
      this.todosContainer.appendChild(itemContainer);

      const todoItem = new TodoItemComponent();
      await todoItem.init(`#todo-item-${todo.id}`);

      todoItem.setData(todo, this.isInstructor);

      todoItem.onSelect(() => {
        if (this.selectCallback) {
          this.selectCallback(todo);
        }
      });

      todoItem.onUpdate((updatedTodo) => {
        if (this.updateCallback) {
          this.updateCallback(updatedTodo);
        }
      });

      this.todoItems.set(todo.id, todoItem);
    }
  }

  /**
   * Registriert einen Callback für Todo-Auswahl
   */
  onTodoSelect(callback: (todo: Todo) => void): void {
    this.selectCallback = callback;
  }

  /**
   * Registriert einen Callback für Todo-Update
   */
  onTodoUpdate(callback: (todo: Todo) => void): void {
    this.updateCallback = callback;
  }

  /**
   * Vernichtet die TodoList
   */
  destroy(): void {
    this.todoItems.forEach((item) => {
      item.destroy();
    });
    this.todoItems.clear();
  }
}
