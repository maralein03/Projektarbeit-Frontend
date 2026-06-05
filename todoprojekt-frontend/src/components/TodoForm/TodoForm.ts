import { Todo, TodoStatus } from '../../types';

export interface TodoFormData {
  title: string;
  description: string;
  assignedTo: string;
  status: TodoStatus;
}

const TEMPLATE = `
  <div class="todo-form-overlay"></div>
  <div class="todo-form-dialog">
    <div class="todo-form-header">
      <h3 id="formTitle">✨ Neue Todo erstellen</h3>
      <button type="button" class="btn-close" id="closeBtn" aria-label="Schließen">✕</button>
    </div>
    
    <form class="todo-form" id="todoForm">
      <!-- Titel-Eingabe -->
      <div class="form-group">
        <label for="titleInput">Titel *</label>
        <input
          type="text"
          id="titleInput"
          class="form-control"
          placeholder="z.B. Keycloak-Anbindung testen"
          required
        />
      </div>

      <!-- Beschreibung -->
      <div class="form-group">
        <label for="descriptionInput">Beschreibung</label>
        <textarea
          id="descriptionInput"
          class="form-control"
          placeholder="Detaillierte Beschreibung der Aufgabe..."
          rows="4"
        ></textarea>
      </div>

      <!-- Zugewiesen an -->
      <div class="form-group">
        <label for="assignedToInput">Zuweisen an (Lernender) *</label>
        <input
          type="text"
          id="assignedToInput"
          class="form-control"
          placeholder="Name des Lernenden eingeben"
          required
        />
      </div>

      <!-- Status-Auswahl -->
      <div class="form-group">
        <label for="statusSelect">Status</label>
        <select id="statusSelect" class="form-control">
          <option value="OPEN">Offen</option>
          <option value="IN_PROGRESS">In Arbeit</option>
          <option value="DONE">Erledigt</option>
          <option value="ACCEPTED">Akzeptiert</option>
        </select>
      </div>

      <!-- Aktions-Buttons -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" id="cancelBtn">Abbrechen</button>
        <button type="submit" class="btn-primary">Speichern</button>
      </div>
    </form>
  </div>
`;

export class TodoFormComponent {
  private container: HTMLElement | null;
  private modal: HTMLElement | null;
  private form: HTMLFormElement | null;
  private submitCallback: ((data: TodoFormData) => void) | null = null;
  private cancelCallback: (() => void) | null = null;
  private currentTodo: Todo | null = null;
  private isNew: boolean = true;

  constructor() {
    this.container = null;
    this.modal = null;
    this.form = null;
  }

  /**
   * Initialisiert die TodoForm-Komponente als Modal
   */
  async init(parentSelector: string): Promise<void> {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      throw new Error(`Parent element ${parentSelector} not found`);
    }

    // Stelle sicher, dass das Modal-Element die Klasse hat
    if (parent instanceof HTMLElement) {
      parent.classList.add('todo-form-modal');
    }

    parent.innerHTML = TEMPLATE;
    this.modal = parent as HTMLElement;
    this.form = parent.querySelector('#todoForm') as HTMLFormElement;

    if (!this.form || !this.modal) {
      throw new Error('Form or Modal element not found in template');
    }

    console.log('TodoForm initialized, modal:', this.modal);
    this.bindEvents();
  }

  /**
   * Bindet Event-Listener an Formular und Modal-Controls
   */
  private bindEvents(): void {
    if (!this.form || !this.modal) return;

    // Form submit
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Cancel button
    const cancelBtn = this.form.querySelector('#cancelBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.hide();
        if (this.cancelCallback) {
          this.cancelCallback();
        }
      });
    }

    // Close button (X)
    const closeBtn = this.modal.querySelector('#closeBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        if (this.cancelCallback) {
          this.cancelCallback();
        }
      });
    }

    // Overlay click (close modal)
    const overlay = this.modal.querySelector('.todo-form-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.hide();
        if (this.cancelCallback) {
          this.cancelCallback();
        }
      });
    }

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
        if (this.cancelCallback) {
          this.cancelCallback();
        }
      }
    });
  }

  /**
   * Behandelt das Absenden des Formulars
   */
  private handleSubmit(): void {
    const titleInput = this.form?.querySelector('#titleInput') as HTMLInputElement;
    const descriptionInput = this.form?.querySelector('#descriptionInput') as HTMLTextAreaElement;
    const assignedToInput = this.form?.querySelector('#assignedToInput') as HTMLInputElement;
    const statusSelect = this.form?.querySelector('#statusSelect') as HTMLSelectElement;

    const title = titleInput?.value.trim() || '';
    const assignedTo = assignedToInput?.value.trim() || '';

    if (!title || !assignedTo) {
      alert('Bitte füllen Sie alle Pflichtfelder (*) aus.');
      return;
    }

    const formData: TodoFormData = {
      title,
      description: descriptionInput?.value || '',
      assignedTo,
      status: (statusSelect?.value as TodoStatus) || 'OPEN',
    };

    console.log('Submitting form data:', formData);
    console.log('Submit callback registered:', !!this.submitCallback);

    if (this.submitCallback) {
      this.submitCallback(formData);
      // Modal wird nach erfolgreichem Submit durch reset() geschlossen
    } else {
      console.error('No submit callback registered!');
      alert('Fehler: Form-Callback nicht registriert');
    }
  }

  /**
   * Zeigt das Modal an
   */
  show(): void {
    if (this.modal) {
      console.log('Showing modal, setting display to flex');
      this.modal.style.display = 'flex';
      // Focus auf das Titel-Input setzen
      setTimeout(() => {
        const titleInput = this.form?.querySelector('#titleInput') as HTMLInputElement;
        if (titleInput) {
          console.log('Focusing title input');
          titleInput.focus();
        }
      }, 100);
    } else {
      console.error('Modal element not found when calling show()');
    }
  }

  /**
   * Versteckt das Modal
   */
  hide(): void {
    if (this.modal) {
      console.log('Hiding modal');
      this.modal.style.display = 'none';
    }
  }

  /**
   * Gibt zurück, ob das Modal sichtbar ist
   */
  isVisible(): boolean {
    return this.modal ? this.modal.style.display === 'flex' : false;
  }

  /**
   * Lädt eine vorhandene Todo zum Bearbeiten
   */
  loadTodo(todo: Todo): void {
    this.currentTodo = todo;
    this.isNew = false;

    const titleInput = this.form?.querySelector('#titleInput') as HTMLInputElement;
    const descriptionInput = this.form?.querySelector('#descriptionInput') as HTMLTextAreaElement;
    const assignedToInput = this.form?.querySelector('#assignedToInput') as HTMLInputElement;
    const statusSelect = this.form?.querySelector('#statusSelect') as HTMLSelectElement;
    const formTitle = this.form?.querySelector('#formTitle');

    if (titleInput) titleInput.value = todo.title || '';
    if (descriptionInput) descriptionInput.value = todo.description || '';
    if (assignedToInput) assignedToInput.value = todo.assignedTo || '';
    if (statusSelect) statusSelect.value = todo.status || 'OPEN';
    if (formTitle) formTitle.textContent = '📝 Aufgabe bearbeiten';
  }

  /**
   * Setzt das Formular auf den Initial-Status zurück
   */
  reset(): void {
    if (this.form) {
      this.form.reset();
    }

    this.currentTodo = null;
    this.isNew = true;

    const formTitle = this.form?.querySelector('#formTitle');
    if (formTitle) {
      formTitle.textContent = '✨ Neue Todo erstellen';
    }

    this.hide();
  }

  /**
   * Registriert einen Callback für Form-Submit
   */
  onSubmit(callback: (data: TodoFormData) => void): void {
    this.submitCallback = callback;
  }

  /**
   * Registriert einen Callback für Cancel
   */
  onCancel(callback: () => void): void {
    this.cancelCallback = callback;
  }

  /**
   * Gibt zurück, ob das Formular eine neue Todo erstellt
   */
  getIsNew(): boolean {
    return this.isNew;
  }
}
