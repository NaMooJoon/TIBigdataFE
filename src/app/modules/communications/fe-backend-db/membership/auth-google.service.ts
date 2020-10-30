import { Injectable, Injector } from "@angular/core";
import { IpService } from 'src/app/ip.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
// import { EPAuthService, Profile, } from './auth.service';
import { logStat, UserProfile } from "./user.model";
import { Auth } from "./userAuth.model";

import { Router } from "@angular/router";
import { DocumentService } from "../../../homes/body/search/service/document/document.service";

import {
  AuthService,
  SocialUser,
  GoogleLoginProvider,
} from "angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService extends Auth {
  getProfile(user: any) {
    throw new Error("Method not implemented.");
  }




  protected URL = this.ipService.get_FE_DB_ServerIp();

  private GOOGLE_REG_URL = this.URL + "/gUser/gRegister";
  private GOOGLE_CHECK_OUR_USER_URL = this.URL + "/gUser/check_is_our_g_user";
  private GOOGLE_VERIFY_TOKEN_URL = this.URL + "/gUser/verifyGoogleToken";
  constructor(
    private injector: Injector,
    private ipService: IpService,
    http: HttpClient,
    router: Router,
    private gauth: AuthService,
    private docSvc: DocumentService,
    // private auth: EPAuthService
  ) {
    super(router, http);
    // this.isLogInObs$.next(logStat.unsigned);
  }
  /**
   * @GoogleSocialLogin
   * Google Social Login functions
   * Functions : login, checkUSer, register, signout, verify token
   */



  /**
   * @function getInstance()
   * @returns google auth 인스턴스를 반환. 싱글턴 패턴 사용.
   */
  getInstance() {
    return this;
  }



  /**
   * @function isOurUser 
   * @param user
   * @description check if this user is already our user. check out from the DB. 
   */
  // isOurUser(user: {}): Promise<any> {
  //   return this.http.post<any>(this.GOOGLE_CHECK_OUR_USER_URL, user).toPromise();
  // }

  register(user: any): Observable<any> {
    return this.http.post<any>(this.GOOGLE_REG_URL, user);
  }

  /**
   * @function gLogIn
   * @param platform 
   * @description user login with google social login
   * 
   */

  async logIn(): Promise<any> {
    let response = await this.googleSignIn();

    /**
     * 정식 패키지를 사용하지 않고 구글에서 제공한 디버깅 방법.
     * 구글 서버로 토큰 정보를 바로 보내 valid한 토큰인지 확인.
     */
    // console.log(response)
    // this.http.get<any>("https://oauth2.googleapis.com/tokeninfo?id_token=" + response.authToken).subscribe(
    //   (res) => {

    //   console.log("resresres")
    //   console.log("GOOGLE AUTH DEBUG: ", res)
    // },err=>{
    //   if(err)
    //   console.error(err)
    // })

    //check if this user is our user already
    let res = await super.postIsOurUser(response, this.GOOGLE_CHECK_OUR_USER_URL)

    if (res.succ == false) {
      //console.log("This user is not yet our user : need sign up : ", res);
      alert("아직 KUBiC 회원이 아니시군요?\n 반갑습니다!\n 회원가입 페이지로 이동합니다. :)");
      this.router.navigateByUrl("/membership/register");
    }
    else {
      this.router.navigate(['/homes'])

      return new UserProfile(response.name, response.email, response.idToken, logStat.google);
      //console.log("This user is already our user!");
      // this.socUser = response as SocialUser;
      //console.log(this.socUser);
      // localStorage.setItem('token', JSON.stringify(new storeToken(logStat.google, this.socUser.idToken)));

      // localStorage.setItem('token',this.socUser.idToken);
      //console.log("login user info saved : ", this.socUser);
      // this.isLogIn = logStat.google;
    }
  }

  /**
   * @description : return user profile
   * @param user : user = {payload : {
   *                                  name : string, 
   *                                  email : string
   *                                  }
   *                      }
   */
  // getProfile(res: any) {
  //   return new Profile(res.user.name, res.user.email);
  // }


  /**
   * @description 루글 로그인 : google login api 사용
   */
  async googleSignIn() {
    let platform = GoogleLoginProvider.PROVIDER_ID;
    return await this.gauth.signIn(platform);

    // return new Promise((resolve) => {
    //   .then((response) => {//error branch 추가할 필요성 있음...
    //     resolve(response);
    //   })
    // })

  }


  /**
   * @description 구글 로그아웃
   */
  logOut(): void {
    localStorage.removeItem("token");
    this.gauth.signOut();
    // this.isLogIn = logStat.unsigned;
  }

  //verify if this token is from google
  verifyToken(token: string): Promise<any> {
    // this.http.get<any>("https://oauth2.googleapis.com/tokeninfo?id_token=" + token).subscribe(res => {
    //   console.log("GOOGLE AUTH DEBUG: ", res)
    // })
    var client = this.injector.get("GOOGLE PROVIDER ID");//get google api client id from angular injector
    // console.log(client);
    return this.http.post<any>(this.GOOGLE_VERIFY_TOKEN_URL, { token: token, client: client }).toPromise();
  }
}
