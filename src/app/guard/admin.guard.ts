import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { filter, map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router=inject(Router)

  return userService.user.pipe(
    filter(user => user !== null),
    take(1), 
    map(user => {
      if (user.role==='admin') {
        return true
      } else {
        router.navigate(['/main'])
        return false
      }
    })
  );
};
