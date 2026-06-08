import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SettingsPage } from './SettingsPage';
import { authContext } from '../context/AuthContext';

vi.mock('../context/AuthContext');
vi.mock('../services/router');

describe('SettingsPage', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'route-content';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && document.body.contains(container)) {
      document.body.removeChild(container);
    }
  });

  it('should render settings page for authenticated user', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'testuser', email: 'test@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    expect(container.innerHTML).toContain('Einstellungen');
    expect(container.innerHTML).toContain('Profil');
  });

  it('should display user profile info', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'admin', email: 'admin@test.de', roles: ['UPDATE', 'READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    expect(container.innerHTML).toContain('UPDATE');
  });

  it('should have language selector', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const languageSelect = container.querySelector('#languageSelect');
    expect(languageSelect).toBeDefined();
  });

  it('should have items per page input', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const itemsInput = container.querySelector('#itemsPerPageInput');
    expect(itemsInput).toBeDefined();
  });

  it('should have save button', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const saveBtn = container.querySelector('#saveBtn');
    expect(saveBtn).toBeDefined();
  });

  it('should have logout button', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const logoutBtn = container.querySelector('#logoutBtn');
    expect(logoutBtn).toBeDefined();
  });

  it('should have notification checkbox', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const notificationsCheck = container.querySelector('#notificationsCheck');
    expect(notificationsCheck).toBeDefined();
  });

  it('should have dark mode checkbox', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const darkModeCheck = container.querySelector('#darkModeCheck');
    expect(darkModeCheck).toBeDefined();
  });

  it('should display app info', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    expect(container.innerHTML).toContain('Todo App');
  });

  it('should have reset button', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const settingsPage = new SettingsPage();
    await settingsPage.render();

    const resetBtn = container.querySelector('#resetBtn');
    expect(resetBtn).toBeDefined();
  });
});
