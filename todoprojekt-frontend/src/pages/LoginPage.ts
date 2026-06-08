import { authContext } from '../context/AuthContext';
import { router } from '../services/router';

const TEMPLATE = `
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);">
    <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); max-width: 400px; width: 90%;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span class="material-icons" style="font-size: 48px; color: #1976d2;">login</span>
        <h1 style="margin: 10px 0 0 0; color: #212121; font-family: Roboto, sans-serif;">Todo App</h1>
        <p style="color: #757575; margin: 5px 0 0 0; font-family: Roboto, sans-serif;">Anmelden mit Keycloak</p>
      </div>

      <div id="loading-container" style="display: none; text-align: center;">
        <p style="color: #1976d2; font-family: Roboto, sans-serif;">Authentifizierung lädt...</p>
      </div>

      <div id="login-container" style="display: flex; flex-direction: column; gap: 15px;">
        <button id="login-btn" style="
          background-color: #1976d2;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          font-family: Roboto, sans-serif;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        ">
          <span class="material-icons">vpn_key</span>
          Anmelden
        </button>

        <p style="text-align: center; color: #757575; font-size: 12px; margin: 0; font-family: Roboto, sans-serif;">
          Bitte melden Sie sich mit Ihrem Keycloak-Konto an
        </p>
      </div>

      <div id="error-container" style="display: none; margin-top: 20px; padding: 12px; background-color: #ffebee; border-radius: 4px;">
        <p id="error-message" style="color: #c62828; margin: 0; font-family: Roboto, sans-serif; font-size: 14px;"></p>
      </div>
    </div>
  </div>
`;

export class LoginPage {
  /**
   * Rendert die Login-Seite
   */
  static async render(): Promise<void> {
    const container = document.getElementById('route-content');
    if (!container) return;

    container.innerHTML = TEMPLATE;
    this.bindEvents();

    // Check if already authenticated
    if (authContext.getState().isAuthenticated) {
      router.navigate('/dashboard');
    }
  }

  /**
   * Bindet Event-Listener
   */
  private static bindEvents(): void {
    const loginBtn = document.getElementById('login-btn');
    loginBtn?.addEventListener('click', () => this.handleLogin());
  }

  /**
   * Verarbeitet Login
   */
  private static async handleLogin(): Promise<void> {
    const loadingContainer = document.getElementById('loading-container');
    const loginContainer = document.getElementById('login-container');
    const errorContainer = document.getElementById('error-container');

    if (loadingContainer) loadingContainer.style.display = 'block';
    if (loginContainer) loginContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'none';

    try {
      await authContext.init();

      const state = authContext.getState();
      if (state.isAuthenticated) {
        // Update router auth state
        router.setAuth(true, state.roles || []);

        // Navigate to dashboard
        router.navigate('/dashboard');
      } else {
        throw new Error('Authentifizierung fehlgeschlagen');
      }
    } catch (error) {
      if (loadingContainer) loadingContainer.style.display = 'none';
      if (loginContainer) loginContainer.style.display = 'flex';
      if (errorContainer) errorContainer.style.display = 'block';

      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.textContent = error instanceof Error ? error.message : 'Login fehlgeschlagen';
      }
    }
  }
}
