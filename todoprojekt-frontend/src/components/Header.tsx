import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          <h1>📝 Todo App</h1>
        </div>
        <div className="header-user">
          <span className="username">{user?.username}</span>
          <span className="role">
            {user?.roles.includes('ROLE_UPDATE') ? '👨‍🏫 Ausbilder' : '👨‍🎓 Lernender'}
          </span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

