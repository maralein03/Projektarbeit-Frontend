import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token invalid/expired - reload so Keycloak re-authenticates
        console.warn('401 received - reloading to trigger Keycloak login');
        window.location.reload();
      } else if (error.status === 403) {
        console.error('Access forbidden:', error);
      } else if (error.status >= 500) {
        console.error('Server error:', error);
      }
      return throwError(() => error);
    })
  );
};
