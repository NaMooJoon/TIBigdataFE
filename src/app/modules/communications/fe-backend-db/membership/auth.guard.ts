import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.getPath(next) === "login"
      || this.getPath(next) === "register"
      || this.getPath(next) === "socReg"
      || this.getPath(next) === "register-ok") {
      if (localStorage.getItem("KUBIC_TOKEN")) {
        window.alert("이미 로그인 되어있습니다!");
        this.router.navigate(['/']);
      }
    }
    else if (!localStorage.getItem("KUBIC_TOKEN")) {
      window.alert("비정상적인 접근입니다. 로그인이 되어있는지 확인해주세요.");
      this.router.navigate(['login'])
    }

    return true;
  }

  getPath(route: ActivatedRouteSnapshot): string {
    var p = route.url[0];
    console.log("curr path : ", p.toString());
    return p.toString()
  }
}
