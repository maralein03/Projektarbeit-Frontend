import { Todo } from '../types';

export interface RouteConfig {
  path: string;
  name: string;
  component: () => Promise<void>;
  requiredRoles?: string[];
  layout?: 'full' | 'with-header';
}

export class Router {
  private currentRoute: RouteConfig | null = null;
  private routes: Map<string, RouteConfig> = new Map();
  private isAuthenticated = false;
  private userRoles: string[] = [];
  private appContainer: HTMLElement | null = null;

  constructor() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  /**
   * Registriert eine Route
   */
  register(config: RouteConfig): void {
    this.routes.set(config.path, config);
  }

  /**
   * Navigiert zu einer Route
   */
  navigate(path: string): void {
    window.location.hash = `#${path}`;
  }

  /**
   * Setzt die Authentifizierung
   */
  setAuth(isAuthenticated: boolean, roles: string[] = []): void {
    this.isAuthenticated = isAuthenticated;
    this.userRoles = roles;
  }

  /**
   * Initialisiert den Router
   */
  init(containerSelector: string): void {
    this.appContainer = document.querySelector(containerSelector);
    if (!this.appContainer) {
      throw new Error(`Container ${containerSelector} not found`);
    }

    // Handle initial route
    this.handleRoute();
  }

  /**
   * Verarbeitet die aktuelle Route
   */
  private async handleRoute(): Promise<void> {
    const path = window.location.hash.slice(1) || '/';
    const route = this.routes.get(path);

    if (!route) {
      // Route not found - redirect to default
      this.navigate('/');
      return;
    }

    // Check authentication
    if (!this.isAuthenticated && path !== '/login') {
      this.navigate('/login');
      return;
    }

    // Check roles
    if (route.requiredRoles && route.requiredRoles.length > 0) {
      const hasRequiredRole = route.requiredRoles.some((role) => this.userRoles.includes(role));
      if (!hasRequiredRole) {
        this.navigate('/');
        return;
      }
    }

    // Store current route and render
    this.currentRoute = route;
    await this.renderRoute(route);
  }

  /**
   * Rendert die Route
   */
  private async renderRoute(route: RouteConfig): Promise<void> {
    if (!this.appContainer) return;

    // Clear container
    this.appContainer.innerHTML = '';

    // Apply layout
    if (route.layout === 'with-header') {
      this.appContainer.innerHTML = `
        <div id="header"></div>
        <main style="display: flex; height: calc(100vh - 60px); overflow: hidden;">
          <div style="flex: 1; overflow-y: auto;">
            <div id="route-content"></div>
          </div>
        </main>
        <div id="todoFormModal" style="display: none;"></div>
        <div id="todoDetail"></div>
      `;
    } else {
      this.appContainer.innerHTML = `<div id="route-content"></div>`;
    }

    // Load component
    await route.component();
  }

  /**
   * Gibt aktuelle Route zurück
   */
  getCurrentRoute(): RouteConfig | null {
    return this.currentRoute;
  }

  /**
   * Gibt aktuellen Pfad zurück
   */
  getCurrentPath(): string {
    return window.location.hash.slice(1) || '/';
  }
}

export const router = new Router();
