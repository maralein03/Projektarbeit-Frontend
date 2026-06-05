import { TodoStatus } from '../../types';

export type FilterType = TodoStatus | 'ALL';

const TEMPLATE = `
<header class="app-header">
  <!-- Linke Seite: Logo / Titel -->
  <div class="header-left">
    <h2>📝 Todo App</h2>
  </div>

  <!-- Mitte: Filter-Buttons -->
  <div class="filter-buttons">
    <button class="filter-btn filter-btn--all" data-filter="ALL">Alle</button>
    <button class="filter-btn" data-filter="OPEN">Open</button>
    <button class="filter-btn" data-filter="IN_PROGRESS">In Progress</button>
    <button class="filter-btn" data-filter="DONE">Done</button>
    <button class="filter-btn" data-filter="ACCEPTED">Accepted</button>
  </div>

  <!-- Rechte Seite: Profil & Logout -->
  <div class="header-right">
    <button class="btn-new-todo" id="newTodoBtn">➕ Neue Todo erstellen</button>
    <span class="username" id="username">-</span>
    <span class="role-badge" id="roleBadge">🧑‍🎓 Lernender</span>
    <button class="btn-logout" id="logoutBtn">Logout</button>
  </div>
</header>
`;

export class HeaderComponent {
  private container: HTMLElement | null;
  private filterChangeCallback: ((filter: FilterType) => void) | null = null;
  private logoutCallback: (() => void) | null = null;
  private newTodoCallback: (() => void) | null = null;
  private activeFilter: FilterType = 'ALL';
  private isInstructor: boolean = false;

  constructor() {
    this.container = null;
  }

  /**
   * Initialisiert die Header-Komponente und bindet Events
   */
  async init(parentSelector: string): Promise<void> {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      throw new Error(`Parent element ${parentSelector} not found`);
    }

    parent.innerHTML = TEMPLATE;
    this.container = parent.querySelector('.app-header') as HTMLElement;

    if (!this.container) {
      throw new Error('Header element not found in template');
    }

    this.bindEvents();
  }

  /**
   * Bindet Event-Listener an Filter-Buttons und Logout-Button
   */
  private bindEvents(): void {
    if (!this.container) return;

    // New Todo Button
    const newTodoBtn = this.container.querySelector('#newTodoBtn');
    if (newTodoBtn) {
      newTodoBtn.addEventListener('click', () => {
        if (this.newTodoCallback) {
          this.newTodoCallback();
        }
      });
    }

    // Filter-Buttons
    const filterButtons = this.container.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const filter = target.getAttribute('data-filter') as FilterType;
        this.setActiveFilter(filter);

        if (this.filterChangeCallback) {
          this.filterChangeCallback(filter);
        }
      });
    });

    // Logout-Button
    const logoutBtn = this.container.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (this.logoutCallback) {
          this.logoutCallback();
        }
      });
    }
  }

  /**
   * Setzt den aktiven Filter und updated das UI
   */
  private setActiveFilter(filter: FilterType): void {
    this.activeFilter = filter;

    if (!this.container) return;

    const filterButtons = this.container.querySelectorAll('.filter-btn');
    filterButtons.forEach((btn) => {
      const btnFilter = btn.getAttribute('data-filter') as FilterType;
      if (btnFilter === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /**
   * Updated die Benutzerinformationen (Username und Rolle)
   */
  updateUserInfo(username: string, isInstructor: boolean): void {
    if (!this.container) return;

    this.isInstructor = isInstructor;

    const usernameEl = this.container.querySelector('#username');
    const roleBadgeEl = this.container.querySelector('#roleBadge');
    const newTodoBtn = this.container.querySelector('#newTodoBtn');

    if (usernameEl) {
      usernameEl.textContent = username || '-';
    }

    if (roleBadgeEl) {
      if (isInstructor) {
        roleBadgeEl.textContent = '👨‍🏫 Ausbilder';
      } else {
        roleBadgeEl.textContent = '🧑‍🎓 Lernender';
      }
    }

    // "Neue Todo erstellen" nur für Ausbilder anzeigen
    if (newTodoBtn) {
      newTodoBtn.style.display = isInstructor ? 'inline-block' : 'none';
    }
  }

  /**
   * Registriert einen Callback für Filter-Änderungen
   */
  onFilterChange(callback: (filter: FilterType) => void): void {
    this.filterChangeCallback = callback;
  }

  /**
   * Registriert einen Callback für Logout
   */
  onLogout(callback: () => void): void {
    this.logoutCallback = callback;
  }

  /**
   * Registriert einen Callback für "New Todo" Button
   */
  onNewTodo(callback: () => void): void {
    this.newTodoCallback = callback;
  }

  /**
   * Gibt die aktuelle Filter-Einstellung zurück
   */
  getActiveFilter(): FilterType {
    return this.activeFilter;
  }
}
