import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden
        console.error('Access forbidden:', error);
      } else if (error.status >= 500) {
        // Server error
        console.error('Server error:', error);
      }
      throw error;
    })
  );
};
