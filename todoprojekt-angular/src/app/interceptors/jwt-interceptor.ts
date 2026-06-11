import { HttpInterceptorFn } from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { KeycloakService } from '../services/keycloak';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  const zone = inject(NgZone);

  // Wrap the Keycloak refresh in NgZone so the resulting Observable emits
  // inside Angular's zone (otherwise change detection won't fire and the UI
  // appears stuck on the loading spinner).
  const refresh$ = from(
    zone.run(() => keycloakService.refreshToken().catch(() => false))
  );

  return refresh$.pipe(
    switchMap(() => {
      const token = keycloakService.getToken();
      const headers: Record<string, string> = {
        'X-Requested-With': 'XMLHttpRequest'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      return next(req.clone({ setHeaders: headers }));
    })
  );
};
