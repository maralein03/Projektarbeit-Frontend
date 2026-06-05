import Keycloak from 'keycloak-js';

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'TODO',
  clientId: 'todoprojekt-frontend', 
});

// Interne Variablen zur Absicherung gegen Mehrfach-Initialisierung
let isInitialized = false;
let initPromise: Promise<boolean> | null = null;

export const initKeycloak = async (): Promise<boolean> => {
  // 1. Wenn bereits erfolgreich initialisiert, sofort true zurückgeben
  if (isInitialized) {
    return true;
  }

  // 2. Wenn die Initialisierung gerade schon läuft, hänge dich an dasselbe Promise an
  if (initPromise) {
    return initPromise;
  }

  // 3. Starte die Initialisierung und speichere das Promise ab
  initPromise = (async () => {
    try {
      const authenticated = await keycloakInstance.init({
        onLoad: 'login-required',   
        checkLoginIframe: false,   
      });
      isInitialized = true; // Erfolg merken!
      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      initPromise = null; // Bei Fehler zurücksetzen, um Neustart zu erlauben
      throw error;
    }
  })();

  return initPromise;
};

export const getKeycloak = () => keycloakInstance;

export const logout = (): void => {
  keycloakInstance.logout({
    redirectUri: window.location.origin 
  });
};

export const getToken = (): string | undefined => keycloakInstance.token;

export const isTokenExpired = (): boolean => {
  // Absicherung falls Keycloak noch nicht bereit ist
  if (!keycloakInstance.token) return true;
  return keycloakInstance.isTokenExpired();
};

export const refreshToken = async (): Promise<string | undefined> => {
  try {
    // Aktualisiert das Token nur, wenn es weniger als 30 Sekunden gültig ist
    await keycloakInstance.updateToken(30);
    return keycloakInstance.token;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};

export const hasRole = (role: string): boolean => {
  return keycloakInstance.hasRealmRole(role);
};

export const getUserInfo = () => {
  return {
    username: keycloakInstance.idTokenParsed?.preferred_username || '',
    email: keycloakInstance.idTokenParsed?.email || '',
    roles: keycloakInstance.realmAccess?.roles || [],
  };
};