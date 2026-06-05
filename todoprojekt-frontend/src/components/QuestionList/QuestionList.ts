import { Question } from '../../types';
import { questionService } from '../../services/questionService';
import { authContext } from '../../context/AuthContext';

const TEMPLATE = `
<div class="question-list">
  <h3>💬 Fragen & Chat (<span id="questionCount">0</span>)</h3>

  <div class="questions" id="questionsContainer">
    <p class="loading">Wird geladen...</p>
  </div>

  <div id="errorMessage" class="error-message" style="display: none;"></div>

  <form class="question-form" id="questionForm" style="display: none;">
    <textarea
      id="questionInput"
      class="form-control"
      placeholder="Schreibe eine Frage oder einen Kommentar..."
      rows="3"
    ></textarea>
    <button type="submit" class="btn-primary" id="submitBtn">Frage stellen</button>
  </form>
</div>
`;

export class QuestionListComponent {
  private container: HTMLElement | null;
  private questions: Question[] = [];
  private todoId: number | null = null;
  private isLoading: boolean = false;
  private isSubmitting: boolean = false;

  constructor() {
    this.container = null;
  }

  /**
   * Initialisiert die QuestionList-Komponente
   */
  async init(parentSelector: string): Promise<void> {
    const parent = document.querySelector(parentSelector);
    if (!parent) {
      throw new Error(`Parent element ${parentSelector} not found`);
    }

    parent.innerHTML = TEMPLATE;
    this.container = parent.querySelector('.question-list') as HTMLElement;

    if (!this.container) {
      throw new Error('QuestionList element not found in template');
    }

    this.bindEvents();
  }

  /**
   * Lädt Fragen für eine bestimmte Todo
   */
  async loadQuestions(todoId: number): Promise<void> {
    this.todoId = todoId;

    try {
      this.isLoading = true;
      this.updateUI();

      const data = await questionService.getQuestionsByTodoId(todoId);
      this.questions = data;
    } catch (error) {
      console.error('Error loading questions:', error);
      this.showError('Fehler beim Abrufen von Fragen');
    } finally {
      this.isLoading = false;
      this.updateUI();
    }
  }

  /**
   * Updated die UI
   */
  private updateUI(): void {
    if (!this.container) return;

    const questionsContainer = this.container.querySelector('#questionsContainer');
    const questionForm = this.container.querySelector('#questionForm') as HTMLFormElement;
    const questionCount = this.container.querySelector('#questionCount');

    if (questionCount) {
      questionCount.textContent = this.questions.length.toString();
    }

    // Zeige Fragen oder Loading-Message
    if (this.isLoading) {
      questionsContainer!.innerHTML = '<p class="loading">Wird geladen...</p>';
      if (questionForm) questionForm.style.display = 'none';
      return;
    }

    if (this.questions.length === 0) {
      questionsContainer!.innerHTML = '<p class="no-questions">Keine Fragen vorhanden</p>';
      if (questionForm) questionForm.style.display = 'flex';
      return;
    }

    // Rendere Fragen
    questionsContainer!.innerHTML = this.questions
      .map(
        (q) => `
      <div class="question-item">
        <div class="question-header">
          <span class="question-author">${this.escapeHtml(q.author)}</span>
          <span class="question-time">${new Date(q.timestamp).toLocaleString('de-DE')}</span>
        </div>
        <p class="question-content">${this.escapeHtml(q.content)}</p>
      </div>
    `
      )
      .join('');

    if (questionForm) questionForm.style.display = 'flex';
  }

  /**
   * Zeigt einen Fehler an
   */
  private showError(message: string): void {
    const errorEl = this.container?.querySelector('#errorMessage');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  /**
   * Bindet Event-Listener
   */
  private bindEvents(): void {
    if (!this.container) return;

    const form = this.container.querySelector('#questionForm') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmitQuestion();
      });
    }
  }

  /**
   * Behandelt das Absenden einer neuen Frage
   */
  private async handleSubmitQuestion(): Promise<void> {
    if (!this.todoId) return;

    const questionInput = this.container?.querySelector('#questionInput') as HTMLTextAreaElement;
    const newQuestion = questionInput?.value.trim() || '';

    if (!newQuestion) {
      return;
    }

    try {
      this.isSubmitting = true;
      this.updateSubmitButton();

      const user = authContext.getUser();
      const username = user?.username || 'Anonym';

      const question = await questionService.createQuestion(
        this.todoId,
        newQuestion,
        username
      );

      this.questions.push(question);
      questionInput.value = '';
      this.updateUI();
      this.hideError();

      // Zeige Erfolgs-Benachrichtigung
      this.showNotification('✅ Frage erfolgreich gesendet!');

      // Browser-Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Todo App', {
          body: `Deine Frage zu diesem Todo wurde gesendet! 💬`,
          tag: `todo-${this.todoId}`
        });
      }
    } catch (error) {
      console.error('Error creating question:', error);
      this.showError('Fehler beim Speichern der Frage');
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton();
    }
  }

  /**
   * Zeigt eine Erfolgs-Benachrichtigung an
   */
  private showNotification(message: string): void {
    const container = this.container;
    if (!container) return;

    // Entferne alte Notification
    const oldNotif = container.querySelector('.notification');
    if (oldNotif) oldNotif.remove();

    // Erstelle neue Notification
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notif);

    // Auto-remove nach 3 Sekunden
    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  /**
   * Updated den Submit-Button Status
   */
  private updateSubmitButton(): void {
    const submitBtn = this.container?.querySelector('#submitBtn') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = this.isSubmitting;
      submitBtn.textContent = this.isSubmitting ? 'Wird gesendet...' : 'Frage stellen';
    }
  }

  /**
   * Versteckt die Error-Message
   */
  private hideError(): void {
    const errorEl = this.container?.querySelector('#errorMessage');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
  }

  /**
   * Escaped HTML um XSS zu verhindern
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
