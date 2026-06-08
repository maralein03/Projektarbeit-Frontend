import './styles/globals.css';
import './index.css';

// Material Design Styles
import '@angular/material/prebuilt-themes/indigo-pink.css';

import { HeaderComponent } from './components/Header/Header';
import { TodoFormComponent } from './components/TodoForm/TodoForm';
import { TodoListComponent } from './components/TodoList/TodoList';
import { TodoDetailComponent } from './components/TodoDetail/TodoDetail';
import { authContext } from './context/AuthContext';
import { todoService } from './services/todoService';
import { Todo, TodoStatus } from './types';

// Import all CSS
import './components/Header/Header.css';
import './components/TodoForm/TodoForm.css';
import './components/TodoList/TodoList.css';
import './components/TodoItem/TodoItem.css';
import './components/TodoDetail/TodoDetail.css';
import './components/QuestionList/QuestionList.css';

// Globale Komponenten
let headerComponent: HeaderComponent | null = null;
let todoFormComponent: TodoFormComponent | null = null;
let todoListComponent: TodoListComponent | null = null;
let todoDetailComponent: TodoDetailComponent | null = null;

let currentFilter: TodoStatus | 'ALL' = 'ALL';
let allTodos: Todo[] = [];

/**
 * Initialisiert die komplette Anwendung
 */
async function initApp(): Promise<void> {
  try {
    // Auth initialisieren
    console.log('Initializing authentication...');
    await authContext.init();

    const state = authContext.getState();

    if (!state.isAuthenticated) {
      showLoadingScreen('Authentifizierung erforderlich. Bitte melden Sie sich an.');
      return;
    }

    console.log('Authentication successful. Initializing UI...');

    // UI initialisieren
    await initializeUI(state.user?.username || 'User', state.hasRole('UPDATE'));

    // Daten laden
    console.log('Loading todos...');
    await loadTodos();

    // Loading-Screen verstecken
    hideLoadingScreen();
  } catch (error) {
    console.error('Error initializing app:', error);
    showLoadingScreen('Fehler beim Laden der Anwendung. Bitte versuchen Sie es später erneut.');
  }
}

/**
 * Initialisiert die UI-Komponenten
 */
async function initializeUI(username: string, isInstructor: boolean): Promise<void> {
  // Header laden und initialisieren
  headerComponent = new HeaderComponent();
  await headerComponent.init('#header');
  headerComponent.updateUserInfo(username, isInstructor);
  headerComponent.onFilterChange((filter) => {
    currentFilter = filter;
    renderTodoList();
  });
  headerComponent.onLogout(() => {
    authContext.performLogout();
    location.reload();
  });
  headerComponent.onNewTodo(() => {
    console.log('New Todo button clicked');
    console.log('todoFormComponent exists:', !!todoFormComponent);
    if (todoFormComponent) {
      console.log('Resetting form');
      todoFormComponent.reset();
      console.log('Showing modal');
      todoFormComponent.show();
    }
  });

  // TodoForm laden
  todoFormComponent = new TodoFormComponent();
  await todoFormComponent.init('#todoFormModal');
  todoFormComponent.onSubmit(async (data) => {
    try {
      if (todoFormComponent?.getIsNew()) {
        await todoService.createTodo(data);
      } else {
        // Update-Logik hier
      }
      await loadTodos();
      todoFormComponent?.reset();
    } catch (error) {
      console.error('Error saving todo:', error);
      alert('Fehler beim Speichern der Aufgabe');
    }
  });
  todoFormComponent.onCancel(() => {
    todoFormComponent?.reset();
  });

  // TodoList laden
  todoListComponent = new TodoListComponent();
  await todoListComponent.init('#todoList');
  todoListComponent.onTodoSelect((todo) => {
    showTodoDetail(todo);
  });
  todoListComponent.onTodoUpdate(() => {
    loadTodos();
  });

  // TodoDetail laden
  todoDetailComponent = new TodoDetailComponent();
  await todoDetailComponent.init('#todoDetail');
  todoDetailComponent.onClose(() => {
    todoDetailComponent?.hide();
  });
}

/**
 * Lädt alle Todos
 */
async function loadTodos(): Promise<void> {
  try {
    allTodos = await todoService.getAllTodos();
    renderTodoList();
  } catch (error) {
    console.error('Error loading todos:', error);
    alert('Fehler beim Laden der Aufgaben');
  }
}

/**
 * Rendert die gefilterte Todo-Liste
 */
function renderTodoList(): void {
  if (!todoListComponent) return;

  const state = authContext.getState();
  const isInstructor = state.hasRole('UPDATE');

  let filteredTodos = allTodos;
  if (currentFilter !== 'ALL') {
    filteredTodos = allTodos.filter((todo) => todo.status === currentFilter);
  }

  todoListComponent.setTodos(filteredTodos, isInstructor);
}

/**
 * Zeigt das Detail-Modal an
 */
async function showTodoDetail(todo: Todo): Promise<void> {
  if (!todoDetailComponent) return;
  await todoDetailComponent.show(todo);
}

/**
 * Zeigt den Loading-Screen an
 */
function showLoadingScreen(message: string = 'Wird geladen...'): void {
  const mainContent = document.getElementById('app');
  if (mainContent) {
    mainContent.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5;">
        <div style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 20px;">⏳</div>
          <p style="font-size: 1.2rem; color: #666;">${message}</p>
        </div>
      </div>
    `;
  }
}

/**
 * Versteckt den Loading-Screen
 */
function hideLoadingScreen(): void {
  // Die Komponenten werden direkt in die entsprechenden Elemente geladen
}

// Starte die App wenn das DOM bereit ist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export für Tests
export { initApp, loadTodos };
