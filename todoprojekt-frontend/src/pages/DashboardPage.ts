import { HeaderComponent } from '../components/Header/Header';
import { TodoFormComponent } from '../components/TodoForm/TodoForm';
import { TodoListComponent } from '../components/TodoList/TodoList';
import { TodoDetailComponent } from '../components/TodoDetail/TodoDetail';
import { authContext } from '../context/AuthContext';
import { todoService } from '../services/todoService';
import { Todo, TodoStatus } from '../types';
import { router } from '../services/router';

export class DashboardPage {
  private headerComponent: HeaderComponent | null = null;
  private todoFormComponent: TodoFormComponent | null = null;
  private todoListComponent: TodoListComponent | null = null;
  private todoDetailComponent: TodoDetailComponent | null = null;

  private currentFilter: TodoStatus | 'ALL' = 'ALL';
  private allTodos: Todo[] = [];

  /**
   * Rendert die Dashboard-Seite
   */
  async render(): Promise<void> {
    const headerContainer = document.getElementById('header');
    const contentContainer = document.getElementById('route-content');

    if (!headerContainer || !contentContainer) return;

    // Create dashboard HTML structure
    contentContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; padding: 20px; overflow-y: auto; flex: 1;">
          <div id="todoList"></div>
          <div style="overflow-y: auto;"></div>
        </div>
      </div>
    `;

    try {
      const state = authContext.getState();

      if (!state.isAuthenticated) {
        router.navigate('/login');
        return;
      }

      // Initialize components
      await this.initializeUI(state.user?.username || 'User', state.hasRole('UPDATE'));

      // Load todos
      await this.loadTodos();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      alert('Fehler beim Laden des Dashboards');
      router.navigate('/login');
    }
  }

  /**
   * Initialisiert die UI-Komponenten
   */
  private async initializeUI(username: string, isInstructor: boolean): Promise<void> {
    // Header laden
    this.headerComponent = new HeaderComponent();
    await this.headerComponent.init('#header');
    this.headerComponent.updateUserInfo(username, isInstructor);
    this.headerComponent.onFilterChange((filter) => {
      this.currentFilter = filter;
      this.renderTodoList();
    });
    this.headerComponent.onLogout(() => {
      authContext.performLogout();
      router.navigate('/login');
    });
    this.headerComponent.onNewTodo(() => {
      if (this.todoFormComponent) {
        this.todoFormComponent.reset();
        this.todoFormComponent.show();
      }
    });

    // TodoForm laden
    this.todoFormComponent = new TodoFormComponent();
    await this.todoFormComponent.init('#todoFormModal');
    this.todoFormComponent.onSubmit(async (data) => {
      try {
        if (this.todoFormComponent?.getIsNew()) {
          await todoService.createTodo(data);
        }
        await this.loadTodos();
        this.todoFormComponent?.reset();
      } catch (error) {
        console.error('Error saving todo:', error);
        alert('Fehler beim Speichern der Aufgabe');
      }
    });
    this.todoFormComponent.onCancel(() => {
      this.todoFormComponent?.reset();
    });

    // TodoList laden
    this.todoListComponent = new TodoListComponent();
    await this.todoListComponent.init('#todoList');
    this.todoListComponent.onTodoSelect((todo) => {
      this.showTodoDetail(todo);
    });
    this.todoListComponent.onTodoUpdate(() => {
      this.loadTodos();
    });

    // TodoDetail laden
    this.todoDetailComponent = new TodoDetailComponent();
    await this.todoDetailComponent.init('#todoDetail');
    this.todoDetailComponent.onClose(() => {
      this.todoDetailComponent?.hide();
    });
  }

  /**
   * Lädt alle Todos
   */
  private async loadTodos(): Promise<void> {
    try {
      this.allTodos = await todoService.getAllTodos();
      this.renderTodoList();
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }

  /**
   * Rendert die gefilterte Todo-Liste
   */
  private renderTodoList(): void {
    if (!this.todoListComponent) return;

    const state = authContext.getState();
    const isInstructor = state.hasRole('UPDATE');

    let filteredTodos = this.allTodos;
    if (this.currentFilter !== 'ALL') {
      filteredTodos = this.allTodos.filter((todo) => todo.status === this.currentFilter);
    }

    this.todoListComponent.setTodos(filteredTodos, isInstructor);
  }

  /**
   * Zeigt das Detail-Modal an
   */
  private async showTodoDetail(todo: Todo): Promise<void> {
    if (!this.todoDetailComponent) return;
    await this.todoDetailComponent.show(todo);
  }
}
