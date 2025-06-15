import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    authService.isAuthenticated.set(true); 
    return true;
  } else {
    authService.isAuthenticated.set(false);
    router.navigate(['/auth/sign-in']);
    return false;
  }
};