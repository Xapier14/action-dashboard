import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
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
        if (!isAuthenticated) {
          this.authService.clearToken();
          this.router.navigate(['/login']);
          resolve(false);
        }
        resolve(true);
      } catch (error) {
        this.authService.clearToken();
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }
}
