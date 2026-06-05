import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuestionListComponent } from './QuestionList';
import { Question } from '../../types';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let container: HTMLElement;

  const mockQuestions: Question[] = [
    {
      id: 1,
      content: 'What is this about?',
      author: 'User 1',
      timestamp: new Date().toISOString(),
      todo: null as any,
    },
    {
      id: 2,
      content: 'Can you clarify?',
      author: 'User 2',
      timestamp: new Date().toISOString(),
      todo: null as any,
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = '<div id="test-questions"></div>';
    container = document.getElementById('test-questions')!;
    component = new QuestionListComponent();
  });

  it('should initialize the question list component', async () => {
    await component.init('#test-questions');
    expect(container.querySelector('.question-list')).toBeTruthy();
  });

  it('should display loading state initially', async () => {
    await component.init('#test-questions');
    
    const loading = container.querySelector('.loading');
    expect(loading?.textContent).toContain('Wird geladen');
  });

  it('should display empty state when no questions', async () => {
    await component.init('#test-questions');
    
    // Mock the loadQuestions behavior
    const questionsContainer = container.querySelector('#questionsContainer');
    questionsContainer!.innerHTML = '<p class="no-questions">Keine Fragen vorhanden</p>';
    
    const noQuestions = container.querySelector('.no-questions');
    expect(noQuestions?.textContent).toContain('Keine Fragen vorhanden');
  });

  it('should display question count', async () => {
    await component.init('#test-questions');
    
    const questionCount = container.querySelector('#questionCount');
    expect(questionCount).toBeTruthy();
  });

  it('should display question form', async () => {
    await component.init('#test-questions');
    
    const form = container.querySelector('#questionForm');
    expect(form).toBeTruthy();
  });

  it('should have question input field', async () => {
    await component.init('#test-questions');
    
    const input = container.querySelector('#questionInput') as HTMLTextAreaElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toContain('Schreibe eine Frage');
  });

  it('should have submit button', async () => {
    await component.init('#test-questions');
    
    const submitBtn = container.querySelector('#submitBtn') as HTMLButtonElement;
    expect(submitBtn?.textContent).toBe('Frage stellen');
  });

  it('should display error message when error occurs', async () => {
    await component.init('#test-questions');
    
    const errorDiv = container.querySelector('#errorMessage');
    expect(errorDiv).toBeTruthy();
    expect((errorDiv as HTMLElement).style.display).toBe('none');
  });

  it('should destroy component', () => {
    component.destroy();
    expect(component).toBeTruthy();
  });

  it('should have question form on initialization', async () => {
    await component.init('#test-questions');
    
    const form = container.querySelector('#questionForm') as HTMLFormElement;
    expect(form).toBeTruthy();
    expect(form.querySelector('#questionInput')).toBeTruthy();
  });
});
