import './styles/globals.css';
import './index.css';

// Material Design Styles
import '@angular/material/prebuilt-themes/indigo-pink.css';

// Import all CSS
import './components/Header/Header.css';
import './components/TodoForm/TodoForm.css';
import './components/TodoList/TodoList.css';
import './components/TodoItem/TodoItem.css';
import './components/TodoDetail/TodoDetail.css';
import './components/QuestionList/QuestionList.css';

import { router } from './services/router';
import { authContext } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

/**
 * Initialisiert die komplette Anwendung mit Routing
 */
async function initApp(): Promise<void> {
  try {
    // Initialize router
    router.init('#app');

    // Register routes
    router.register({
      path: '/login',
      name: 'Login',
      component: LoginPage.render,
      layout: 'full',
    });

    router.register({
      path: '/dashboard',
      name: 'Dashboard',
      component: async () => {
        const dashboard = new DashboardPage();
        await dashboard.render();
      },
      layout: 'with-header',
    });

    // Default route
    router.register({
      path: '/',
      name: 'Home',
      component: async () => {
        // Try to check auth state and redirect
        try {
          const state = authContext.getState();
          if (state.isAuthenticated) {
            router.navigate('/dashboard');
          } else {
            router.navigate('/login');
          }
        } catch {
          router.navigate('/login');
        }
      },
    });

    // Try initial auth
    try {
      const initialState = authContext.getState();
      if (initialState.isAuthenticated) {
        router.setAuth(true, initialState.roles || []);
        router.navigate('/dashboard');
      } else {
        router.navigate('/login');
      }
    } catch {
      router.navigate('/login');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5;">
          <div style="text-align: center;">
            <p style="font-size: 1.2rem; color: #666;">Fehler beim Laden der Anwendung</p>
            <p style="color: #999; margin-top: 10px;">Bitte laden Sie die Seite neu</p>
          </div>
        </div>
      `;
    }
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for tests
export { initApp };
