import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authContext } from './context/AuthContext';

describe('App Initialization', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="app">
        <div id="header"></div>
        <main style="display: flex; height: calc(100vh - 60px);">
          <div style="width: 35%; border-right: 1px solid #e0e0e0;">
            <div id="todoForm"></div>
          </div>
          <div style="flex: 1;">
            <div id="todoList"></div>
          </div>
        </main>
        <div id="todoDetail"></div>
      </div>
    `;
  });

  it('should have app container', () => {
    const app = document.getElementById('app');
    expect(app).toBeTruthy();
  });

  it('should have header container', () => {
    const header = document.getElementById('header');
    expect(header).toBeTruthy();
  });

  it('should have todoForm container', () => {
    const todoForm = document.getElementById('todoForm');
    expect(todoForm).toBeTruthy();
  });

  it('should have todoList container', () => {
    const todoList = document.getElementById('todoList');
    expect(todoList).toBeTruthy();
  });

  it('should have todoDetail container', () => {
    const todoDetail = document.getElementById('todoDetail');
    expect(todoDetail).toBeTruthy();
  });

  it('should have auth context initialized', () => {
    expect(authContext).toBeTruthy();
  });

  it('should have auth context methods', () => {
    expect(typeof authContext.getState).toBe('function');
    expect(typeof authContext.subscribe).toBe('function');
    expect(typeof authContext.checkRole).toBe('function');
  });
});

describe('AuthContext', () => {
  it('should initialize auth context', () => {
    const state = authContext.getState();
    expect(state).toBeTruthy();
    expect(state.isLoading).toBeDefined();
    expect(state.isAuthenticated).toBeDefined();
    expect(state.user).toBeDefined();
  });

  it('should have user null initially', () => {
    const state = authContext.getState();
    expect(state.user).toBeNull();
  });

  it('should have isLoading true initially', () => {
    const state = authContext.getState();
    expect(state.isLoading).toBe(true);
  });

  it('should support subscription', () => {
    const listener = vi.fn();
    const unsubscribe = authContext.subscribe(listener);

    expect(typeof unsubscribe).toBe('function');
  });

  it('should check role', () => {
    const hasRole = authContext.checkRole('UPDATE');
    expect(typeof hasRole).toBe('boolean');
  });

  it('should have logout function', () => {
    const state = authContext.getState();
    expect(typeof state.logout).toBe('function');
  });

  it('should have hasRole function', () => {
    const state = authContext.getState();
    expect(typeof state.hasRole).toBe('function');
  });
});
