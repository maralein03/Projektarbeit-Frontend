import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);

  // Check if user is authenticated
  try {
    // In a real scenario, you would check keycloak.authenticated
    // For now, return true as Keycloak handles login-required on init
    return true;
  } catch (error) {
    console.error('Auth guard error:', error);
    router.navigate(['/login']);
    return false;
  }
};
