import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.isAuthenticated()) {
    // If the user is authenticated, allow access to the route
    return true;
  } else {
    // If the user is not authenticated, redirect to the login page
    return router.createUrlTree(['/login']);
  }
};
