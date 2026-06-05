import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TodoStatus } from '../types';

// 1. Definition der Props, die der Header empfangen darf
interface HeaderProps {
  activeFilter: TodoStatus | 'ALL';
  onFilterChange: (filter: TodoStatus | 'ALL') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeFilter, onFilterChange }) => {
  const { user, logout, hasRole } = useAuth();
  
  const isInstructor = hasRole('ROLE_UPDATE');

  return (
    <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#0066cc', color: '#fff' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2>📝 Todo App</h2>
      </div>

      {/* Die Filter-Buttons aus deinem Screenshot */}
      <div className="filter-buttons" style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => onFilterChange('ALL')} 
          className={activeFilter === 'ALL' ? 'btn-filter active' : 'btn-filter'}
          style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: activeFilter === 'ALL' ? '#fff' : 'rgba(255,255,255,0.2)', color: activeFilter === 'ALL' ? '#0066cc' : '#fff', fontWeight: 'bold' }}
        >
          Alle
        </button>
        <button 
          onClick={() => onFilterChange('OPEN')} 
          className={activeFilter === 'OPEN' ? 'btn-filter active' : 'btn-filter'}
          style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: activeFilter === 'OPEN' ? '#fff' : 'rgba(255,255,255,0.2)', color: activeFilter === 'OPEN' ? '#0066cc' : '#fff', fontWeight: 'bold' }}
        >
          Open
        </button>
        <button 
          onClick={() => onFilterChange('IN_PROGRESS')} 
          className={activeFilter === 'IN_PROGRESS' ? 'btn-filter active' : 'btn-filter'}
          style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: activeFilter === 'IN_PROGRESS' ? '#fff' : 'rgba(255,255,255,0.2)', color: activeFilter === 'IN_PROGRESS' ? '#0066cc' : '#fff', fontWeight: 'bold' }}
        >
          In Progress
        </button>
        <button 
          onClick={() => onFilterChange('DONE')} 
          className={activeFilter === 'DONE' ? 'btn-filter active' : 'btn-filter'}
          style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: activeFilter === 'DONE' ? '#fff' : 'rgba(255,255,255,0.2)', color: activeFilter === 'DONE' ? '#0066cc' : '#fff', fontWeight: 'bold' }}
        >
          Done
        </button>
        <button 
          onClick={() => onFilterChange('ACCEPTED')} 
          className={activeFilter === 'ACCEPTED' ? 'btn-filter active' : 'btn-filter'}
          style={{ padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', backgroundColor: activeFilter === 'ACCEPTED' ? '#fff' : 'rgba(255,255,255,0.2)', color: activeFilter === 'ACCEPTED' ? '#0066cc' : '#fff', fontWeight: 'bold' }}
        >
          Accepted
        </button>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontWeight: 'bold' }}>{user?.username}</span>
        <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
          {isInstructor ? '👨‍🏫 Ausbilder' : '🧑‍🎓 Lernender'}
        </span>
        <button onClick={logout} style={{ padding: '6px 12px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </header>
  );
};