// Interceptor nuevo
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/usuarios/login', '/api/usuarios/register'];
  const router = inject(Router);

  const ngrokHeader = {
    'ngrok-skip-browser-warning': 'true'
  };

  // Peticiones excluidas (login/register)
  if (excludedUrls.some(url => req.url.includes(url))) {
    const reqWithNgrokHeader = req.clone({
      setHeaders: ngrokHeader
    });
    return next(reqWithNgrokHeader);
  }

  // Peticiones autenticadas
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const storedData = localStorage.getItem('user_data');
    if (storedData) {
      const { token } = JSON.parse(storedData);
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            ...ngrokHeader
          }
        });
        return next(authReq);
      }
    } else {
      router.navigate(['/auth/sign-in']);
    }
  }

  // Si no hay token, igual agregá el header de Ngrok
  const fallbackReq = req.clone({
    setHeaders: ngrokHeader
  });

  return next(fallbackReq);
};

/*
interceptor original

import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/api/usuarios/login', '/api/usuarios/register'];
  const router = inject(Router);

  if (excludedUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const storedData = localStorage.getItem('user_data');
    if (storedData) {
      const { token } = JSON.parse(storedData);
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }
    } else {
       router.navigate(['/auth/sign-in']);
    }
  }

  return next(req);
};*/
