import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad, UrlSegment, ActivatedRouteSnapshot } from '@angular/router';
import { EPAuthService } from './auth.service';

// class UserToken{}
class Permissions {
  canActivate(isLogin, routeId: import("@angular/router").Route, segments: UrlSegment[]): boolean {
    if (isLogin)
      return false;
    return true
    // if(!isLogin && )
    // return true;
  }
}


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: EPAuthService,
    private _router: Router, ) { }
  // private permissions : Permissions) {}
  // canLoad(route: import("@angular/router").Route, segments: UrlSegment[]): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {
  //   // throw new Error("Method not implemented.");
  //   return this.permissions.canLoadCond(this.authService.getLogInStat(),route,segments);
  // }

  /**
   * scenario
   * 
   * user : not log in -> membership/mypage : deny with alert("log in first plz"). go to login page first?
   * user : log in -> membership/login : already login. aleart(you have already login. redirect page to main.)
   * 
   */
  //

  getPath(route: ActivatedRouteSnapshot): string {
    var p = route.url[0];
    console.log("curr path : ", p.toString());
    return p.toString()
  }
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log(route)
    console.log(this.getPath(route));
    if (this.getPath(route) === "login" ||this.getPath(route) ==="register"||this.getPath(route) ==="socReg") {//user access to login page
      //when login stat is not login, access ok. when already login, access no.
      console.log("curr login stat :",this.authService.getLogInStat());
      return !this.authService.getLogInStat()? true : false;
    }
    
    if(this.getPath(route) === "userpage" || this.getPath(route) === ""){
      //when login stat is login, access ok. when user not login, access no.
      console.log("curr login stat :",this.authService.getLogInStat());
      return this.authService.getLogInStat()? true : false;
    }

    

    return false
  }

}
