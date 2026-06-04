import Keycloak from 'keycloak-js';

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'TODO',
  clientId: 'todoprojekt-frontend', 
});

export const initKeycloak = async (): Promise<boolean> => {
  try {
    const authenticated = await keycloakInstance.init({
      onLoad: 'login-required',   
      checkLoginIframe: false,   
    });
    return authenticated;
  } catch (error) {
    console.error('Failed to initialize Keycloak', error);
    throw error;
  }
};

export const getKeycloak = () => keycloakInstance;

export const logout = (): void => {
  keycloakInstance.logout({
    redirectUri: window.location.origin 
  });
};

export const getToken = (): string | undefined => keycloakInstance.token;

export const isTokenExpired = (): boolean => keycloakInstance.isTokenExpired();


export const refreshToken = async (): Promise<string | undefined> => {
  try {
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