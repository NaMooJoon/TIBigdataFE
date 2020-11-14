import { UserProfile, logStat } from "./user.model"
import { Router } from '@angular/router'
import { HttpClient } from "@angular/common/http";
import { Res } from "../res.model";

/**
 * Token stored in front end browser.
 * check login type among email, google, facebook, etc...
 * check token value.
 */
class storeToken {
  //property coverage should be considered more... use private?
  type: logStat;
  token: string;

  constructor(type: logStat, token: string) {
    this.type = type;
    this.token = token
  }
}

export abstract class Auth {
  router: Router;
  http: HttpClient;
  constructor(router: Router, http: HttpClient) {
    this.router = router;
    this.http = http;
  }

  abstract verifyToken(tk): Promise<any>;

  /**
   * send request to /eUser/eCheckUser with user email information and get response if there is duplicated email in our db.
   * 
   * @param user: user information from registration form
   * @param URL: request destination. fe-backend-ip-address/eUser/eCheckUser
   * @returns Object that clones  response for request
   */
  async postIsOurUser(user, URL: string): Promise<any> {
    /* Send request with user data and recieve response */
    let res = await this.http.post<any>(URL, user).toPromise();

    let isOurUserRes = new Res(res.succ, res.msg, res.payload);
    return isOurUserRes;
  };

  postLoginRequset(URL: string, user) {
    return this.http.post<any>(URL, user).toPromise();
  }


  /**
   * 
   * @param user 로그인하는 유저. 구글의 경우 undefined
   * @return 로그인 성공 했을 때 email인지 구글인지 어느 방식인지 반환
   */
  // abstract logIn(user?): Promise<any>;

  async logIn(URL: string, user): Promise<any> {
    let isOurUser = await this.postIsOurUser(user, URL);
    // console.log(isOurUser);
    if (!isOurUser.succ) {//if this user is one of us, deny registration.
      alert("아직 KUBiC 회원이 아니시군요? 회원가입 해주세요! :)");
      //비밀번호 찾기 페이지도 만들어야 한다. 
    }
    else {
      //console.log("user input check : ", user);
      var res = await this.postLoginRequset(URL, user)
      // console.log("login process result : ", res);
      // login succ
      if (res.succ) {
        alert("돌아오신 걸 환영합니다, " + res.payload.name + "님. 홈 화면으로 이동합니다.");
        //var pf = new UserProfile(logStat.email, res.payload.email, res.payload.name, res.payload.token)
        //this.confirmUser(pf);
        // return { logStat: logStat.email, token: res.payload.toekn, name: res.payload.name, email: res.payload.email };
      }
      //login fail. maybe wrong password or id?
      if (!res.succ) {
        alert("이메일 혹은 비밀번호가 잘못되었어요.");
        return null;
      }
      err => {
        console.log(err)
      }
    }
  };

  abstract logOut(): void;
  // abstract getProfile(user);
  // register():Promise<any>;
  abstract getInstance();
  abstract register(user: any): void

  /**
   * 
   * @param stat 
   * @param user 로그인 확정할 유저 정보. user = { token : 토큰 string, name : string, email : string}
   */
  confirmUser(profile: UserProfile): void {

    localStorage.setItem('token', JSON.stringify(new storeToken(profile.registerStat, profile.token)));
    this.router.navigate(['/homes']);
  }
}