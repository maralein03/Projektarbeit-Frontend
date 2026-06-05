import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TodoStatus } from '../types';

interface HeaderProps {
  activeFilter: TodoStatus | 'ALL';
  onFilterChange: (filter: TodoStatus | 'ALL') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeFilter, onFilterChange }) => {
  const { user, logout, hasRole } = useAuth();
  
  // Überprüft das Keycloak-Rollen-Array exakt auf 'UPDATE'
  const isInstructor = hasRole('UPDATE');

  return (
    <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', backgroundColor: '#0066cc', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
      
      {/* Linke Seite: Logo / Titel */}
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px' }}>📝 Todo App</h2>
      </div>

      {/* Mitte: Die Filter-Buttons */}
      <div className="filter-buttons" style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(0,0,0,0.15)', padding: '4px', borderRadius: '24px' }}>
        {(['ALL', 'OPEN', 'IN_PROGRESS', 'DONE', 'ACCEPTED'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          const labelMap: Record<string, string> = {
            ALL: 'Alle',
            OPEN: 'Open',
            IN_PROGRESS: 'In Progress',
            DONE: 'Done',
            ACCEPTED: 'Accepted'
          };
          
          return (
            <button 
              key={filter}
              onClick={() => onFilterChange(filter)} 
              style={{ 
                padding: '6px 16px', 
                borderRadius: '20px', 
                border: 'none', 
                cursor: 'pointer', 
                backgroundColor: isActive ? '#fff' : 'transparent', 
                color: isActive ? '#0066cc' : '#fff', 
                fontWeight: '600',
                fontSize: '0.88rem',
                transition: 'all 0.2s ease'
              }}
            >
              {labelMap[filter]}
            </button>
          );
        })}
      </div>

      {/* Rechte Seite: Profil & Logout */}
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{user?.username}</span>
        
        <span style={{ backgroundColor: 'rgba(255,255,255,0.18)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '600', letterSpacing: '0.3px' }}>
          {isInstructor ? '👨‍🏫 Ausbilder' : '🧑‍🎓 Lernender'}
        </span>
        
        <button 
          onClick={logout} 
          style={{ padding: '6px 14px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', transition: 'background-color 0.15s' }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e63939'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff4d4d'}
        >
          Logout
        </button>
      </div>
    </header>
  );
};