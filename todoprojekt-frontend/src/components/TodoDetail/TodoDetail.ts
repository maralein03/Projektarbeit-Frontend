import { Todo, TodoStatus } from '../../types';

const TEMPLATE = `
<div class="todo-detail-overlay" id="todoDetailOverlay">
  <div class="todo-detail-modal">
    <div class="modal-header">
      <h2 id="detailTitle">-</h2>
      <button class="close-btn" id="closeBtn">✕</button>
    </div>

    <div class="modal-content">
      <div id="contentContainer">
        <div class="todo-detail-section">
          <h3>Aufgabendetails</h3>
          <div class="detail-row">
            <label>Status:</label>
            <span class="status-badge" id="detailStatus">OPEN</span>
          </div>
          <div class="detail-row">
            <label>Zugewiesen an:</label>
            <span id="detailAssignedTo">-</span>
          </div>
          <div class="detail-row">
            <label>Erstellt am:</label>
            <span id="detailCreatedAt">-</span>
          </div>
          <div class="detail-row full-width">
            <label>Beschreibung:</label>
            <p class="description" id="detailDescription">-</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn-secondary" id="closeBtn2">Schließen</button>
    </div>
  </div>
</div>
`;

export class TodoDetailComponent {
  private container: HTMLElement | null;
  private overlay: HTMLElement | null;
  private todo: Todo | null = null;
  private closeCallback: (() => void) | null = null;
  private updateCallback: ((todo: Todo) => void) | null = null;

  constructor() {
    this.container = null;
    this.overlay = null;
  }

  /**
   * Initialisiert die TodoDetail-Komponente
   */
  async init(parentSelector: string): Promise<void> {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      throw new Error(`Parent element ${parentSelector} not found`);
    }

    parent.innerHTML = TEMPLATE;
    this.overlay = parent.querySelector('#todoDetailOverlay') as HTMLElement;
    this.container = parent.querySelector('.todo-detail-modal') as HTMLElement;

    if (!this.overlay || !this.container) {
      throw new Error('TodoDetail elements not found in template');
    }

    this.bindEvents();
  }

  /**
   * Zeigt ein Todo-Detail an
   */
  async show(todo: Todo): Promise<void> {
    this.todo = todo;

    if (this.overlay) {
      this.overlay.style.display = 'flex';
    }

    // Zeige Loading-State
    const loadingContainer = this.container?.querySelector('#loadingContainer');
    const contentContainer = this.container?.querySelector('#contentContainer');
    if (contentContainer) contentContainer.style.display = 'block';

    // Rendere Daten
    this.render();

    // QuestionList im Popover laden
    const questionListContainer = this.overlay?.querySelector(
      '#questionListContainer'
    );
    if (questionListContainer && todo.id) {
      this.questionList = new QuestionListComponent();
      await this.questionList.init('#questionListContainer');
      await this.questionList.loadQuestions(todo.id);
    }
  }

  /**
   * Rendert die Todo-Details
   */
  private render(): void {
    if (!this.todo || !this.container) return;

    const titleEl = this.container.querySelector('#detailTitle');
    const descriptionEl = this.container.querySelector('#detailDescription');
    const statusEl = this.container.querySelector('#detailStatus');
    const assignedToEl = this.container.querySelector('#detailAssignedTo');
    const createdAtEl = this.container.querySelector('#detailCreatedAt');

    if (titleEl) titleEl.textContent = this.todo.title || '-';
    if (descriptionEl) descriptionEl.textContent = this.todo.description || '-';
    if (assignedToEl) assignedToEl.textContent = this.todo.assignedTo || '-';
    if (createdAtEl)
      createdAtEl.textContent = new Date(this.todo.createdAt).toLocaleDateString('de-DE');

    this.updateStatusBadge(this.todo.status);
  }

  /**
   * Updated das Status-Badge
   */
  private updateStatusBadge(status: TodoStatus): void {
    const statusEl = this.container?.querySelector('#detailStatus');
    if (!statusEl) return;

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

    statusEl.textContent = statusMap[status] || status;
    statusEl.className = `status-badge ${classMap[status]}`;
  }

  /**
   * Bindet Event-Listener
   */
  private bindEvents(): void {
    const closeBtn1 = this.container?.querySelector('#closeBtn');
    const closeBtn2 = this.container?.querySelector('#closeBtn2');
    const overlay = this.overlay;

    const closeHandler = () => {
      if (this.closeCallback) {
        this.closeCallback();
      }
      this.hide();
    };

    closeBtn1?.addEventListener('click', closeHandler);
    closeBtn2?.addEventListener('click', closeHandler);

    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeHandler();
      }
    });
  }

  /**
   * Blendet die Detail-View aus
   */
  hide(): void {
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
  }

  /**
   * Registriert einen Callback für Close
   */
  onClose(callback: () => void): void {
    this.closeCallback = callback;
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
    this.hide();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
