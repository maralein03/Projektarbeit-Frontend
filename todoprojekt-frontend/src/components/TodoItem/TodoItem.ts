import { Todo, TodoStatus } from '../../types';
import { todoService } from '../../services/todoService';
import { QuestionListComponent } from '../QuestionList/QuestionList';

const TEMPLATE = `
<div class="todo-item-card">
  <div class="card-header">
    <div class="todo-info">
      <h4 class="todo-title" id="todoTitle">-</h4>
      <p class="todo-description" id="todoDescription">-</p>
    </div>
    <div class="status-section">
      <span class="status-badge" id="statusBadge">OPEN</span>
      <button class="chat-icon-btn" id="chatIconBtn" title="Chat öffnen">💬</button>
    </div>
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

  <!-- Chat Popover -->
  <div class="chat-popover" id="chatPopover" style="display: none;">
    <div class="popover-header">
      <h3>💬 Fragen & Chat</h3>
      <button class="popover-close" id="chatPopoverClose">✕</button>
    </div>
    <div class="popover-content" id="questionListContainer"></div>
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
  private questionList: QuestionListComponent | null = null;

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

    // Chat-Button Handler
    const chatIconBtn = this.container.querySelector('#chatIconBtn');
    chatIconBtn?.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.toggleChatPopover();
    });

    // Popover-Close Handler
    const chatPopoverClose = this.container.querySelector('#chatPopoverClose');
    chatPopoverClose?.addEventListener('click', () => {
      this.toggleChatPopover();
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
   * Toggelt das Chat-Popover
   */
  private async toggleChatPopover(): Promise<void> {
    const chatPopover = this.container?.querySelector('#chatPopover') as HTMLElement;
    if (!chatPopover) return;

    const isVisible = chatPopover.style.display !== 'none';
    
    if (!isVisible) {
      // Schließe alle anderen Popovers
      document.querySelectorAll('.chat-popover').forEach((popover) => {
        if (popover !== chatPopover) {
          popover.style.display = 'none';
        }
      });

      // Popover wird geöffnet - lade QuestionList
      if (!this.questionList && this.todo) {
        const questionListContainer = this.container?.querySelector('#questionListContainer');
        if (questionListContainer) {
          this.questionList = new QuestionListComponent();
          await this.questionList.init('#questionListContainer');
          await this.questionList.loadQuestions(this.todo.id);
        }
      }
    }

    chatPopover.style.display = isVisible ? 'none' : 'flex';
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
   * Zeigt das Chat-Badge wenn Fragen existieren
   */
  showChatBadge(show: boolean = true): void {
    const chatBadge = this.container?.querySelector('#chatBadge');
    if (chatBadge) {
      chatBadge.style.display = show ? 'inline-block' : 'none';
    }
  }

  /**
   * Vernichtet die Komponente
   */
  destroy(): void {
    if (this.questionList) {
      this.questionList.destroy();
      this.questionList = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
