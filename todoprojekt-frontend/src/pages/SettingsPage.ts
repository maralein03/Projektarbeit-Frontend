import { authContext } from '../context/AuthContext';
import { router } from '../services/router';

/**
 * Settings Page - Benutzereinstellungen und Profileinstellungen
 */
export class SettingsPage {
  private userPreferences = {
    theme: 'light',
    language: 'de',
    itemsPerPage: 10,
    notifications: false,
    darkMode: false,
  };

  async render(): Promise<void> {
    // Initialize preferences from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      this.userPreferences = {
        theme: localStorage.getItem('app-theme') || 'light',
        language: localStorage.getItem('app-language') || 'de',
        itemsPerPage: parseInt(localStorage.getItem('app-items-per-page') || '10'),
        notifications: localStorage.getItem('app-notifications') === 'true',
        darkMode: localStorage.getItem('app-dark-mode') === 'true',
      };
    }

    const container = document.getElementById('route-content');
    if (!container) throw new Error('Container nicht gefunden');

    const authState = authContext.getState();

    container.innerHTML = `
      <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
          <h1 style="margin: 0 0 10px 0; color: #1976d2; display: flex; align-items: center; gap: 10px;">
            <span class="material-icons" style="font-size: 32px;">settings</span>
            Einstellungen
          </h1>
          <div style="color: #666; font-size: 14px;">
            Personalisieren Sie Ihre App-Erfahrung
          </div>
        </div>

        <!-- Profil Sektion -->
        <div style="background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #333; display: flex; align-items: center; gap: 8px;">
            <span class="material-icons" style="font-size: 20px;">person</span>
            Profil
          </h2>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Benutzername</label>
              <div style="padding: 10px 12px; background: #f5f5f5; border-radius: 4px; color: #333;">
                ${authState && authState.user && authState.user.username ? authState.user.username : 'Benutzer'}
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Rollen</label>
              <div style="padding: 10px 12px; background: #f5f5f5; border-radius: 4px; color: #333;">
                ${authState && authState.user && authState.user.roles && authState.user.roles.length > 0 ? authState.user.roles.join(', ') : 'Keine Rollen'}
              </div>
            </div>
          </div>

          <div style="margin-top: 16px;">
            <button id="logoutBtn" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
              <span class="material-icons" style="font-size: 18px;">logout</span>
              Abmelden
            </button>
          </div>
        </div>

        <!-- App Einstellungen -->
        <div style="background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px;">
          <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #333; display: flex; align-items: center; gap: 8px;">
            <span class="material-icons" style="font-size: 20px;">tune</span>
            App-Einstellungen
          </h2>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Sprache</label>
            <select id="languageSelect" style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background: white;">
              <option value="de" ${this.userPreferences.language === 'de' ? 'selected' : ''}>Deutsch</option>
              <option value="en" ${this.userPreferences.language === 'en' ? 'selected' : ''}>English</option>
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Todos pro Seite</label>
            <input 
              id="itemsPerPageInput" 
              type="number" 
              min="5" 
              max="50" 
              value="${this.userPreferences.itemsPerPage}"
              style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
            />
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px;">
            <label style="font-size: 14px; color: #333; display: flex; align-items: center; gap: 8px; margin: 0; cursor: pointer;">
              <input 
                id="notificationsCheck" 
                type="checkbox" 
                ${this.userPreferences.notifications ? 'checked' : ''}
                style="width: 18px; height: 18px; cursor: pointer;"
              />
              Benachrichtigungen aktivieren
            </label>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f5f5f5; border-radius: 4px; margin-bottom: 16px;">
            <label style="font-size: 14px; color: #333; display: flex; align-items: center; gap: 8px; margin: 0; cursor: pointer;">
              <input 
                id="darkModeCheck" 
                type="checkbox" 
                ${this.userPreferences.darkMode ? 'checked' : ''}
                style="width: 18px; height: 18px; cursor: pointer;"
              />
              Dunkler Modus
            </label>
          </div>
        </div>

        <!-- Info Sektion -->
        <div style="background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px;">
          <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #333; display: flex; align-items: center; gap: 8px;">
            <span class="material-icons" style="font-size: 20px;">info</span>
            Über
          </h2>

          <div style="color: #666; font-size: 14px; line-height: 1.6;">
            <div style="margin-bottom: 12px;">
              <strong>Todo App</strong><br>
              Version 1.0.0
            </div>
            <div style="margin-bottom: 12px;">
              <strong>Technologie:</strong><br>
              Vanilla TypeScript + Vite + Vitest
            </div>
            <div>
              <strong>Authentifizierung:</strong><br>
              Keycloak OAuth2
            </div>
          </div>
        </div>

        <!-- Speichern Button -->
        <div style="margin-top: 30px; display: flex; gap: 10px;">
          <button id="saveBtn" style="background: #1976d2; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
            <span class="material-icons" style="font-size: 18px;">save</span>
            Speichern
          </button>
          <button id="resetBtn" style="background: #757575; color: white; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
            <span class="material-icons" style="font-size: 18px;">refresh</span>
            Zurücksetzen
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        router.navigate('/login');
      });
    }

    // Save
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.saveSettings();
      });
    }

    // Reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        location.reload();
      });
    }

    // Logout Button Hover
    if (logoutBtn) {
      logoutBtn.addEventListener('mouseover', () => {
        (logoutBtn as HTMLElement).style.background = '#e53935';
      });
      logoutBtn.addEventListener('mouseout', () => {
        (logoutBtn as HTMLElement).style.background = '#f44336';
      });
    }

    // Save Button Hover
    if (saveBtn) {
      saveBtn.addEventListener('mouseover', () => {
        (saveBtn as HTMLElement).style.background = '#1565c0';
      });
      saveBtn.addEventListener('mouseout', () => {
        (saveBtn as HTMLElement).style.background = '#1976d2';
      });
    }

    // Reset Button Hover
    if (resetBtn) {
      resetBtn.addEventListener('mouseover', () => {
        (resetBtn as HTMLElement).style.background = '#616161';
      });
      resetBtn.addEventListener('mouseout', () => {
        (resetBtn as HTMLElement).style.background = '#757575';
      });
    }
  }

  private saveSettings(): void {
    const language = (document.getElementById('languageSelect') as HTMLSelectElement)?.value;
    const itemsPerPage = (document.getElementById('itemsPerPageInput') as HTMLInputElement)?.value;
    const notifications = (document.getElementById('notificationsCheck') as HTMLInputElement)?.checked;
    const darkMode = (document.getElementById('darkModeCheck') as HTMLInputElement)?.checked;

    if (language) localStorage.setItem('app-language', language);
    if (itemsPerPage) localStorage.setItem('app-items-per-page', itemsPerPage);
    localStorage.setItem('app-notifications', notifications ? 'true' : 'false');
    localStorage.setItem('app-dark-mode', darkMode ? 'true' : 'false');

    // Show success message
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = '<span class="material-icons" style="font-size: 18px;">check</span> Gespeichert!';
      (saveBtn as HTMLElement).style.background = '#4caf50';

      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        (saveBtn as HTMLElement).style.background = '#1976d2';
      }, 2000);
    }
  }
}
