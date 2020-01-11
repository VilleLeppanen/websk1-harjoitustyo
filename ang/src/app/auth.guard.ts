import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { AuthService } from "./auth.service";

import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem("accesstoken")) {
      // katsoo onko token vielä voimassa
      const token = JSON.parse(localStorage.getItem("accesstoken")).token;
      const tokenValid = this.authService.checkToken(token); // true jos token ok

      // jos token ok
      if (tokenValid) {
        return true;
      } else {
        localStorage.removeItem("accesstoken");
        return false;
      }
    }

    this.router.navigate(["login"]);
    return false;
  }
}
