import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    // do not allow below pages when user is logged in.
    if (
      this.getPath(next) === "login" ||
      this.getPath(next) === "register" ||
      this.getPath(next) === "socReg" ||
      this.getPath(next) === "register-ok"
    ) {
      if (localStorage.getItem("KUBIC_TOKEN")) {
        window.alert("이미 로그인 되어있습니다!");
        this.router.navigate(["/"]);
      }
    // other pages follows canActivate policy set in routing module
    } else if (!localStorage.getItem("KUBIC_TOKEN")) {
      window.alert("비정상적인 접근입니다. 로그인이 되어있는지 확인해주세요.");
      this.router.navigate(["login"]);
    }

    return true;
  }

  getPath(route: ActivatedRouteSnapshot): string {
    if (route.url.length === 0) return "";
    var p = route.url[0];
    return p.toString();
  }
}
