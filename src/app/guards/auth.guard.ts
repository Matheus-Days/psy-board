import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard =
  (inverted = false): CanActivateFn =>
  async () => {
    const userService = inject(UserService);
    const router = inject(Router);

    const userData = await userService.checkRegistered();

    if (userData && !inverted) {
      return true;
    }

    if (!userData && inverted) {
      return true;
    }
    
    if (inverted) {
      return router.createUrlTree(['/config']);
    } else {
      return router.createUrlTree(['/login']);
    }
  };
