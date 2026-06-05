import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HeaderComponent, FilterType } from './Header';
import { TodoStatus } from '../../types';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let container: HTMLElement;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="test-header"></div>';
    container = document.getElementById('test-header')!;

    component = new HeaderComponent();
  });

  it('should initialize the header component', async () => {
    await component.init('#test-header');
    expect(container.querySelector('.app-header')).toBeTruthy();
  });

  it('should display user information', async () => {
    await component.init('#test-header');
    component.updateUserInfo('John Doe', false);

    const usernameEl = container.querySelector('#username');
    const roleBadgeEl = container.querySelector('#roleBadge');

    expect(usernameEl?.textContent).toBe('John Doe');
    expect(roleBadgeEl?.textContent).toContain('Lernender');
  });

  it('should display instructor role when isInstructor is true', async () => {
    await component.init('#test-header');
    component.updateUserInfo('Jane Smith', true);

    const roleBadgeEl = container.querySelector('#roleBadge');
    expect(roleBadgeEl?.textContent).toContain('Ausbilder');
  });

  it('should trigger filter change callback', async () => {
    await component.init('#test-header');
    const filterCallback = vi.fn();
    component.onFilterChange(filterCallback);

    const filterBtn = container.querySelector('[data-filter="OPEN"]') as HTMLButtonElement;
    filterBtn?.click();

    expect(filterCallback).toHaveBeenCalledWith('OPEN');
  });

  it('should set active filter styling', async () => {
    await component.init('#test-header');
    const filterBtn = container.querySelector('[data-filter="ALL"]') as HTMLButtonElement;

    filterBtn?.click();

    expect(filterBtn.classList.contains('active')).toBe(true);
  });

  it('should trigger logout callback', async () => {
    await component.init('#test-header');
    const logoutCallback = vi.fn();
    component.onLogout(logoutCallback);

    const logoutBtn = container.querySelector('#logoutBtn') as HTMLButtonElement;
    logoutBtn?.click();

    expect(logoutCallback).toHaveBeenCalled();
  });

  it('should return active filter', async () => {
    await component.init('#test-header');
    const filter = component.getActiveFilter();
    expect(filter).toBe('ALL');
  });

  it('should update active filter', async () => {
    await component.init('#test-header');
    const filterBtn = container.querySelector('[data-filter="DONE"]') as HTMLButtonElement;
    filterBtn?.click();

    expect(component.getActiveFilter()).toBe('DONE');
  });
});
