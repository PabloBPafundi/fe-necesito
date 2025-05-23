import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log(authService.isAuthenticated())
    return true;
  } else {
    console.log(authService.isAuthenticated())
    router.navigate(['/auth/sign-in']);
    return false;

  }
};
