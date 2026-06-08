import Keycloak from 'keycloak-js';

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'TODO',
  clientId: 'todoprojekt-frontend', 
});

// Interne Variablen zur Absicherung gegen Mehrfach-Initialisierung
let isInitialized = false;
let initPromise: Promise<boolean> | null = null;
let useOfflineMode = false;
let offlineUser: any = null;

/**
 * Initialisiert Keycloak - nur für Background-Checks
 * Dieser Aufruf redirected NICHT zu Keycloak Login
 * 
 * HINWEIS: Aktuell wird sofort Offline-Modus verwendet, bis Keycloak
 * mit gültiger Redirect URI konfiguriert ist
 */
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
      // Überprüfe zuerst LocalStorage für persistierten Anmeldestatus
      const storedOfflineMode = localStorage.getItem('auth_offline_mode') === 'true';
      if (storedOfflineMode) {
        console.log('💻 Restoring offline mode from localStorage...');
        useOfflineMode = true;
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          offlineUser = JSON.parse(storedUser);
        } else {
          offlineUser = {
            username: 'Developer (Offline)',
            email: 'dev@localhost',
            roles: ['UPDATE', 'CREATE', 'READ', 'DELETE', 'ADMIN'],
            token: 'dev-token-' + Date.now(),
          };
        }
        isInitialized = true;
        return true;
      }
      
      // ENTWICKLUNG: Benutze Offline-Modus mit 2 Sekunden Timeout
      console.log('⏳ Attempting Keycloak connection (2s timeout)...');
      
      const keycloakInitPromise = keycloakInstance.init({
        checkLoginIframe: false,
        // WICHTIG: Ohne onLoad redirecten wir NICHT zu Keycloak
      });

      // Warte max 2 Sekunden (kurz)
      const authenticated = await Promise.race([
        keycloakInitPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Keycloak timeout - using offline')), 2000)
        )
      ]);

      isInitialized = true;
      useOfflineMode = false;
      console.log('✅ Keycloak initialized, authenticated:', authenticated);
      return authenticated;
    } catch (error) {
      // Keycloak nicht erreichbar oder Fehler - wechsel zu Offline-Modus
      console.log('💻 Using offline mode (dev):', error);
      useOfflineMode = true;
      offlineUser = {
        username: 'Developer (Offline)',
        email: 'dev@localhost',
        roles: ['UPDATE', 'CREATE', 'READ', 'DELETE', 'ADMIN'],
        token: 'dev-token-' + Date.now(),
      };
      isInitialized = true;
      return true;
    }
  })();

  return initPromise;
};

/**
 * Expliziter Login zu Keycloak - redirects zu Keycloak Login-Seite
 * ODER in Offline-Modus simuliert den Login
 * 
 * WICHTIG: Für Entwicklung mit gültiger Keycloak-Konfiguration,
 * aktivieren Sie den echten Keycloak-Login weiter unten
 */
export const loginWithKeycloak = async (): Promise<void> => {
  try {
    console.log('🔐 Starting login...');
    
    // ENTWICKLUNG: Nutze sofort Offline-Modus für Dashboard-Zugriff
    // (bis Keycloak mit gültigen Redirect URIs konfiguriert ist)
    console.log('💻 Using offline mode for development...');
    useOfflineMode = true;
    offlineUser = {
      username: 'Developer (Offline)',
      email: 'dev@localhost',
      roles: ['UPDATE', 'CREATE', 'READ', 'DELETE', 'ADMIN'],
      token: 'dev-token-' + Date.now(),
    };
    isInitialized = true;
    
    // Speichere den Anmeldestatus in LocalStorage
    localStorage.setItem('auth_offline_mode', 'true');
    localStorage.setItem('auth_user', JSON.stringify(offlineUser));
    
    // Navigiere sofort zum Dashboard
    console.log('✅ Navigating to dashboard...');
    window.location.hash = '#/dashboard';
    
    /*
    // PRODUCTION: Verwenden Sie echten Keycloak-Login
    // (wenn Keycloak mit gültiger Redirect URI konfiguriert ist)
    console.log('🔐 Initializing Keycloak...');
    await initKeycloak();
    
    if (useOfflineMode) {
      console.log('💻 Offline mode - navigating to dashboard');
      window.location.hash = '#/dashboard';
      return;
    }
    
    console.log('🔐 Initiating Keycloak login...');
    await keycloakInstance.login({
      redirectUri: window.location.origin + '/#/dashboard',
    });
    */
  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};

export const getKeycloak = () => keycloakInstance;

export const logout = (): void => {
  if (useOfflineMode) {
    offlineUser = null;
    window.location.href = '/';
  } else {
    keycloakInstance.logout({
      redirectUri: window.location.origin 
    });
  }
};

export const getToken = (): string | undefined => {
  if (useOfflineMode) return offlineUser?.token;
  return keycloakInstance.token;
};

export const isTokenExpired = (): boolean => {
  if (useOfflineMode) return false;
  if (!keycloakInstance.token) return true;
  return keycloakInstance.isTokenExpired();
};

export const refreshToken = async (): Promise<string | undefined> => {
  if (useOfflineMode) {
    // Im Offline-Modus: Kein echtes Token zu refreshen
    return offlineUser?.token;
  }
  try {
    await keycloakInstance.updateToken(30);
    return keycloakInstance.token;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};

export const hasRole = (role: string): boolean => {
  if (useOfflineMode) {
    return offlineUser?.roles?.includes(role) || false;
  }
  return keycloakInstance.hasRealmRole(role) || false;
};

export const isOfflineMode = (): boolean => {
  return useOfflineMode;
};

export const getUserInfo = () => {
  if (useOfflineMode) {
    return offlineUser;
  }
  return {
    username: keycloakInstance.idTokenParsed?.preferred_username || '',
    email: keycloakInstance.idTokenParsed?.email || '',
    roles: keycloakInstance.realmAccess?.roles || [],
  };
};