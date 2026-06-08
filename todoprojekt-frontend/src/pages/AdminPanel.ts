import { authContext } from '../context/AuthContext';
import { todoService } from '../services/todoService';
import { Todo } from '../types';

/**
 * Admin Panel - Verwaltungskonsole für Ausbilder
 * Nur für Nutzer mit ADMIN/UPDATE-Rolle zugänglich
 */
export class AdminPanel {
  private todos: Todo[] = [];

  async render(): Promise<void> {
    const container = document.getElementById('route-content');
    if (!container) throw new Error('Container nicht gefunden');

    // Check if user is admin
    const authState = authContext.getState();
    if (!authState.isAuthenticated || !authState.user?.roles?.includes('UPDATE')) {
      container.innerHTML = `
        <div style="padding: 20px; text-align: center; margin-top: 40px;">
          <div style="color: #d32f2f; font-size: 18px; margin-bottom: 10px;">
            Zugriff verweigert
          </div>
          <div style="color: #666;">
            Sie haben keine Berechtigung, auf das Admin Panel zuzugreifen.
          </div>
        </div>
      `;
      return;
    }

    try {
      this.todos = await todoService.getAllTodos();
      this.renderAdminPanel(container);
    } catch (error) {
      console.error('Fehler beim Laden der Admin-Daten:', error);
      container.innerHTML = `
        <div style="padding: 20px; color: #d32f2f;">
          Fehler beim Laden der Admin-Daten
        </div>
      `;
    }
  }

  private renderAdminPanel(container: HTMLElement): void {
    const stats = this.calculateStats();

    container.innerHTML = `
      <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
        <!-- Header -->
        <div style="margin-bottom: 30px;">
          <h1 style="margin: 0 0 10px 0; color: #1976d2; display: flex; align-items: center; gap: 10px;">
            <span class="material-icons" style="font-size: 32px;">admin_panel_settings</span>
            Admin Panel
          </h1>
          <div style="color: #666; font-size: 14px;">
            Verwaltungskonsole für Todos und Statistiken
          </div>
        </div>

        <!-- Stats Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 30px;">
          ${this.renderStatsCard('task_alt', 'Gesamt Todos', stats.total, '#1976d2')}
          ${this.renderStatsCard('schedule', 'Offen', stats.open, '#ff9800')}
          ${this.renderStatsCard('progress_activity', 'In Bearbeitung', stats.inProgress, '#2196f3')}
          ${this.renderStatsCard('check_circle', 'Erledigt', stats.done, '#4caf50')}
        </div>

        <!-- Todos Table -->
        <div style="background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="padding: 16px; border-bottom: 1px solid #e0e0e0; font-weight: 500;">
            Alle Todos (${this.todos.length})
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5; border-bottom: 1px solid #e0e0e0;">
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; font-size: 12px; color: #666; text-transform: uppercase;">Titel</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; font-size: 12px; color: #666; text-transform: uppercase;">Status</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; font-size: 12px; color: #666; text-transform: uppercase;">Zugewiesen an</th>
                <th style="padding: 12px 16px; text-align: left; font-weight: 500; font-size: 12px; color: #666; text-transform: uppercase;">Erstellt</th>
              </tr>
            </thead>
            <tbody>
              ${this.todos
                .slice(0, 10)
                .map(
                  (todo) => `
                <tr style="border-bottom: 1px solid #e0e0e0; transition: background 0.2s;">
                  <td style="padding: 12px 16px; color: #333;">${this.escapeHtml(todo.title)}</td>
                  <td style="padding: 12px 16px;">
                    <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${this.getStatusColor(todo.status)}20; color: ${this.getStatusColor(todo.status)};">
                      ${this.getStatusLabel(todo.status)}
                    </span>
                  </td>
                  <td style="padding: 12px 16px; color: #666;">${this.escapeHtml(todo.assignedTo || '—')}</td>
                  <td style="padding: 12px 16px; color: #666; font-size: 13px;">${new Date(todo.createdAt).toLocaleDateString('de-DE')}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          ${
            this.todos.length > 10
              ? `<div style="padding: 12px 16px; background: #f5f5f5; color: #666; font-size: 13px;">
                  ... und ${this.todos.length - 10} weitere Todos
                </div>`
              : ''
          }
        </div>

        <!-- Distribution Chart -->
        <div style="margin-top: 30px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 16px;">
          <div style="font-weight: 500; margin-bottom: 16px;">Status-Verteilung</div>
          ${this.renderProgressBar('Offen', stats.open, stats.total, '#ff9800')}
          ${this.renderProgressBar('In Bearbeitung', stats.inProgress, stats.total, '#2196f3')}
          ${this.renderProgressBar('Erledigt', stats.done, stats.total, '#4caf50')}
        </div>
      </div>
    `;
  }

  private renderStatsCard(icon: string, label: string, value: number, color: string): string {
    return `
      <div style="background: white; border-radius: 4px; padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 16px;">
        <div style="background: ${color}20; color: ${color}; border-radius: 8px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
          <span class="material-icons">${icon}</span>
        </div>
        <div>
          <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${label}</div>
          <div style="font-size: 24px; font-weight: 500; color: #333;">${value}</div>
        </div>
      </div>
    `;
  }

  private renderProgressBar(label: string, value: number, total: number, color: string): string {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
          <span>${label}</span>
          <span style="color: #666;">${value} (${Math.round(percentage)}%)</span>
        </div>
        <div style="background: #e0e0e0; border-radius: 4px; height: 8px; overflow: hidden;">
          <div style="background: ${color}; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  }

  private calculateStats(): { total: number; open: number; inProgress: number; done: number } {
    return {
      total: this.todos.length,
      open: this.todos.filter((t) => t.status === 'OPEN').length,
      inProgress: this.todos.filter((t) => t.status === 'IN_PROGRESS').length,
      done: this.todos.filter((t) => t.status === 'DONE').length,
    };
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'OPEN':
        return '#ff9800';
      case 'IN_PROGRESS':
        return '#2196f3';
      case 'DONE':
        return '#4caf50';
      default:
        return '#666';
    }
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'Offen';
      case 'IN_PROGRESS':
        return 'In Bearbeitung';
      case 'DONE':
        return 'Erledigt';
      default:
        return status;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
