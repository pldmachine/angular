
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AuthService } from "app/services/auth.service";

@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(private authService: AuthService) {

    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isLoggedIn = this.authService.isLoggedIn();
        console.log('canActivate', isLoggedIn);
        return isLoggedIn;
    }
}
