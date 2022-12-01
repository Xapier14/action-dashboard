import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.hasToken()) {
      this.router.navigate(['/error/unauthorized']);
      return false;
    }

    return new Promise(async (resolve) => {
      try {
        const isAuthenticated = await this.authService.isAuthenticated();
        console.log(isAuthenticated);
        if (!isAuthenticated) {
          this.authService.clearToken();
          alert('Your session has expired. Please login again.');
          this.router.navigate(['/login']);
          resolve(false);
        }
        resolve(true);
      } catch (error) {
        alert(
          'An error occured while checking your session. Please login again.'
        );
        this.authService.clearToken();
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }
}
