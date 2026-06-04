import Keycloak from 'keycloak-js';

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'todo-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'todo-app',
});

export const initKeycloak = async () => {
  try {
    const authenticated = await keycloakInstance.init({
      onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    });
    return authenticated;
  } catch (error) {
    console.error('Failed to initialize Keycloak', error);
    throw error;
  }
};

export const getKeycloak = () => keycloakInstance;

export const logout = () => {
  keycloakInstance.logout();
};

export const getToken = () => keycloakInstance.token;

export const isTokenExpired = () => keycloakInstance.isTokenExpired();

export const refreshToken = async () => {
  try {
    await keycloakInstance.refreshToken();
    return keycloakInstance.token;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};

export const hasRole = (role: string) => {
  return keycloakInstance.hasRealmRole(role) || keycloakInstance.hasClientRole(role);
};

export const getUserInfo = () => {
  return {
    username: keycloakInstance.idTokenParsed?.preferred_username || '',
    email: keycloakInstance.idTokenParsed?.email || '',
    roles: keycloakInstance.realmAccess?.roles || [],
  };
};
