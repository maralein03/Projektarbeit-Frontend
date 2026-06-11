import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { KeycloakService } from '../services/keycloak';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // Refresh token if it expires within 30 seconds, then attach the (refreshed) token
  return from(keycloakService.refreshToken().catch(() => false)).pipe(
    switchMap(() => {
      const token = keycloakService.getToken();
      let authReq = req;

      if (token) {
        authReq = authReq.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
      } else {
        authReq = authReq.clone({
          setHeaders: { 'X-Requested-With': 'XMLHttpRequest' }
        });
      }

      return next(authReq);
    })
  );
};
