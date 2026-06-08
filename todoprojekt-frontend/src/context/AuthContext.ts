import { AuthUser } from '../types';
import { initKeycloak, getKeycloak, logout, getUserInfo, hasRole } from '../services/keycloak';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

/**
 * Globaler Auth-Service als Alternative zu React Context
 */
class AuthService {
  private user: AuthUser | null = null;
  private isAuthenticated: boolean = false;
  private isLoading: boolean = true;
  private error: string | null = null;
  private listeners: Set<() => void> = new Set();

  /**
   * Initialisiert die Auth
   */
  async init(): Promise<void> {
    try {
      this.isLoading = true;
      this.notifyListeners();

      const authenticated = await initKeycloak();

      if (authenticated) {
        const userInfo = await getUserInfo();
        const keycloak = getKeycloak();

        this.user = {
          username: userInfo?.username || 'Developer',
          email: userInfo?.email || 'dev@localhost',
          roles: userInfo?.roles || ['UPDATE'],
          token: keycloak?.token || userInfo?.token || 'token',
        };
        this.isAuthenticated = true;
        this.error = null;
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      this.error = errorMessage;
      this.isAuthenticated = false;
      this.user = null;
    } finally {
      this.isLoading = false;
      this.notifyListeners();
    }
  }

  /**
   * Logout durchführen
   */
  performLogout(): void {
    logout();
    this.user = null;
    this.isAuthenticated = false;
    this.notifyListeners();
  }

  /**
   * Gibt den aktuellen User zurück
   */
  getUser(): AuthUser | null {
    return this.user;
  }

  /**
   * Gibt den Auth-Status zurück
   */
  getState(): AuthContextType {
    return {
      user: this.user,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error,
      logout: () => this.performLogout(),
      hasRole: (role: string) => hasRole(role),
    };
  }

  /**
   * Prüft ob Benutzer eine Rolle hat
   */
  checkRole(role: string): boolean {
    return hasRole(role);
  }

  /**
   * Registriert einen Listener für State-Änderungen
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Benachrichtigt alle Listener
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}

// Globale Instanz
export const authContext = new AuthService();

// Exportiere die alte Schnittstelle für Rückwärtskompatibilität
export const useAuth = (): AuthContextType => {
  return authContext.getState();
};
