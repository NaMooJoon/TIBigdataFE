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
  abstract logIn(user?: any): void;
  abstract logOut(): void;
  abstract getInstance();
  abstract register(user: any): void

}