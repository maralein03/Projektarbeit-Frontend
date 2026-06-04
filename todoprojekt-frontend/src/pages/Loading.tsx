import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Loading.css';

export const Loading: React.FC = () => {
  const { error } = useAuth();

  if (error) {
    return (
      <div className="loading-container">
        <div className="loading-error">
          <h2>Authentifizierungsfehler</h2>
          <p>{error}</p>
          <p>Bitte kontaktiere deinen Administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Authentifizierung lädt...</p>
    </div>
  );
};
