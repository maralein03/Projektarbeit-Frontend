import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AdminPanel } from './AdminPanel';
import { authContext } from '../context/AuthContext';
import { todoService } from '../services/todoService';

vi.mock('../context/AuthContext');
vi.mock('../services/todoService');

describe('AdminPanel', () => {
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

  it('should render admin panel for authenticated admin user', async () => {
    const mockTodos = [
      {
        id: 1,
        title: 'Test',
        description: 'Desc',
        assignedTo: 'John',
        status: 'OPEN' as const,
        createdAt: new Date(),
        createdBy: 'user1',
        updatedAt: new Date(),
      },
    ] as any;

    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'admin', email: 'admin@test.de', roles: ['UPDATE'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    vi.mocked(todoService.getAllTodos).mockResolvedValue(mockTodos);

    const adminPanel = new AdminPanel();
    await adminPanel.render();

    expect(container.innerHTML).toContain('Admin Panel');
  });

  it('should show access denied for non-admin user', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'user', email: 'user@test.de', roles: ['READ'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    const adminPanel = new AdminPanel();
    await adminPanel.render();

    expect(container.innerHTML).toContain('Zugriff verweigert');
  });

  it('should show error message on service failure', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'admin', email: 'admin@test.de', roles: ['UPDATE'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    vi.mocked(todoService.getAllTodos).mockRejectedValue(new Error('Error'));

    const adminPanel = new AdminPanel();
    await adminPanel.render();

    expect(container.innerHTML).toContain('Fehler');
  });

  it('should display stats', async () => {
    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'admin', email: 'admin@test.de', roles: ['UPDATE'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    vi.mocked(todoService.getAllTodos).mockResolvedValue([]);

    const adminPanel = new AdminPanel();
    await adminPanel.render();

    expect(container.innerHTML).toContain('Gesamt');
  });

  it('should render with multiple todos', async () => {
    const mockTodos = [
      {
        id: 1,
        title: 'Todo 1',
        description: 'Desc',
        assignedTo: 'John',
        status: 'OPEN' as const,
        createdAt: new Date(),
        createdBy: 'user1',
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Todo 2',
        description: 'Desc',
        assignedTo: 'Jane',
        status: 'DONE' as const,
        createdAt: new Date(),
        createdBy: 'user2',
        updatedAt: new Date(),
      },
    ] as any;

    vi.mocked(authContext.getState).mockReturnValue({
      user: { username: 'admin', email: 'admin@test.de', roles: ['UPDATE'], token: 'token123' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      logout: vi.fn(),
      hasRole: vi.fn(),
    } as any);

    vi.mocked(todoService.getAllTodos).mockResolvedValue(mockTodos);

    const adminPanel = new AdminPanel();
    await adminPanel.render();

    expect(container.innerHTML).toContain('Admin Panel');
  });
});
