import { Todo, TodoStatus } from '../../types';
import { todoService } from '../../services/todoService';

const TEMPLATE = `
<div class="todo-item-card">
  <div class="card-header">
    <div class="todo-info">
      <h4 class="todo-title" id="todoTitle">-</h4>
      <p class="todo-description" id="todoDescription">-</p>
    </div>
    <span class="status-badge" id="statusBadge">OPEN</span>
  </div>

  <div class="card-body">
    <div class="todo-meta">
      <span class="meta-item">
        <strong>Zugewiesen an:</strong> <span id="assignedTo">-</span>
      </span>
      <span class="meta-item">
        <strong>Erstellt:</strong> <span id="createdAt">-</span>
      </span>
    </div>
  </div>

  <div class="card-actions">
    <button class="btn-action btn-select" id="selectBtn">📖 Details anzeigen</button>
    <div class="status-change-container" id="statusContainer" style="display: none;">
      <button class="btn-action btn-status-change" id="statusChangeBtn">⚙️ Status ändern</button>
      <div id="statusMenu" class="status-menu" style="display: none;">
        <button class="status-option" data-status="OPEN">Offen</button>
        <button class="status-option" data-status="IN_PROGRESS">In Arbeit</button>
        <button class="status-option" data-status="DONE">Erledigt</button>
        <button class="status-option" data-status="ACCEPTED">Akzeptiert</button>
      </div>
    </div>
  </div>

  <div id="loadingSpinner" class="loading-spinner" style="display: none;">
    <span></span>
  </div>
</div>
`;

export class TodoItemComponent {
  private container: HTMLElement | null;
  private todo: Todo | null = null;
  private isInstructor: boolean = false;
  private selectCallback: (() => void) | null = null;
  private updateCallback: ((todo: Todo) => void) | null = null;

  constructor() {
    this.container = null;
  }

  /**
   * Initialisiert die TodoItem-Komponente
   */
  async init(parentSelector: string): Promise<void> {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      throw new Error(`Parent element ${parentSelector} not found`);
    }

    parent.innerHTML = TEMPLATE;
    this.container = parent.querySelector('.todo-item-card') as HTMLElement;

    if (!this.container) {
      throw new Error('TodoItem element not found in template');
    }

    this.bindEvents();
  }

  /**
   * Setzt die Todo-Daten und rendert sie
   */
  setData(todo: Todo, isInstructor: boolean = false): void {
    this.todo = todo;
    this.isInstructor = isInstructor;
    this.render();
  }

  /**
   * Rendert die Todo-Item
   */
  private render(): void {
    if (!this.todo || !this.container) return;

    const titleEl = this.container.querySelector('#todoTitle');
    const descriptionEl = this.container.querySelector('#todoDescription');
    const statusBadgeEl = this.container.querySelector('#statusBadge');
    const assignedToEl = this.container.querySelector('#assignedTo');
    const createdAtEl = this.container.querySelector('#createdAt');
    const statusContainer = this.container.querySelector('#statusContainer');

    if (titleEl) titleEl.textContent = this.todo.title || '-';
    if (descriptionEl) descriptionEl.textContent = this.todo.description || '-';
    if (assignedToEl) assignedToEl.textContent = this.todo.assignedTo || '-';
    if (createdAtEl)
      createdAtEl.textContent = new Date(this.todo.createdAt).toLocaleDateString('de-DE');

    this.updateStatusBadge(this.todo.status);

    // Zeige Status-Change nur für Instructors
    if (statusContainer) {
      statusContainer.style.display = this.isInstructor ? 'block' : 'none';
    }
  }

  /**
   * Updated das Status-Badge
   */
  private updateStatusBadge(status: TodoStatus): void {
    const statusBadgeEl = this.container?.querySelector('#statusBadge');
    if (!statusBadgeEl) return;

    const statusMap: Record<TodoStatus, string> = {
      OPEN: 'Offen',
      IN_PROGRESS: 'In Arbeit',
      DONE: 'Erledigt',
      ACCEPTED: 'Akzeptiert',
    };

    const classMap: Record<TodoStatus, string> = {
      OPEN: 'open',
      IN_PROGRESS: 'in-progress',
      DONE: 'done',
      ACCEPTED: 'accepted',
    };

    statusBadgeEl.textContent = statusMap[status] || status;
    statusBadgeEl.className = `status-badge ${classMap[status]}`;
  }

  /**
   * Bindet Event-Listener
   */
  private bindEvents(): void {
    if (!this.container) return;

    const selectBtn = this.container.querySelector('#selectBtn');
    selectBtn?.addEventListener('click', () => {
      if (this.selectCallback) {
        this.selectCallback();
      }
    });

    const statusChangeBtn = this.container.querySelector('#statusChangeBtn');
    const statusMenu = this.container.querySelector('#statusMenu');

    // Status-Change Button klickbar
    statusChangeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = statusMenu?.style.display !== 'none';
      statusMenu!.style.display = isVisible ? 'none' : 'block';
    });

    const statusOptions = this.container.querySelectorAll('.status-option');
    statusOptions.forEach((option) => {
      option.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const newStatus = target.getAttribute('data-status') as TodoStatus;
        this.handleStatusChange(newStatus);
        statusMenu!.style.display = 'none';
      });
    });

    // Schließe das Menu wenn man woanders klickt
    document.addEventListener('click', (e) => {
      if (!this.container?.contains(e.target as Node)) {
        statusMenu!.style.display = 'none';
      }
    });
  }

  /**
   * Behandelt Status-Änderungen
   */
  private async handleStatusChange(newStatus: TodoStatus): Promise<void> {
    if (!this.todo) return;

    const loadingSpinner = this.container?.querySelector('#loadingSpinner');
    if (loadingSpinner) {
      loadingSpinner.style.display = 'block';
    }

    try {
      const updated = await todoService.updateTodoStatus(this.todo.id, newStatus);
      this.todo = updated;
      this.render();

      if (this.updateCallback) {
        this.updateCallback(updated);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Fehler beim Aktualisieren des Status');
    } finally {
      if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
      }
    }
  }

  /**
   * Registriert einen Callback für Auswahl
   */
  onSelect(callback: () => void): void {
    this.selectCallback = callback;
  }

  /**
   * Registriert einen Callback für Update
   */
  onUpdate(callback: (todo: Todo) => void): void {
    this.updateCallback = callback;
  }

  /**
   * Vernichtet die Komponente
   */
  destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
