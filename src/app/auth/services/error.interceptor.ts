import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(err => {

      if ((err.status === 401 || err.status === 403) &&
          typeof window !== 'undefined' &&
          typeof localStorage !== 'undefined') {
        localStorage.removeItem('user_data');

        router.navigate(['/auth/sign-in']);
      }

      return throwError(() => err);
    })
  );
};
