import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { QueryResponse } from "src/app/core/models/query.response.model";
import { UserProfile } from "src/app/core/models/user.model";
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from "angularx-social-login";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private API_URL: string = "http://localhost:14000";
  private headers = new HttpHeaders().set("Content-Type", "application/json");
  private currentUserChange$: BehaviorSubject<UserProfile> = new BehaviorSubject(
    null
  );
  private currentUser: UserProfile;
  private isLoggedIn: boolean;
  private UPDATE_API_AUTH = this.API_URL + "/users/apiRegister";
  private PROVIDER_ID: string =
    "576807286455-35sjp2v8leqpfeg3qj7k2rfr3avns7a5.apps.googleusercontent.com";

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.currentUserChange$.subscribe((currentUser: UserProfile) => {
      this.isLoggedIn = currentUser != null;
    });
  }

  getCurrentUserChange(): Observable<UserProfile> {
    return this.currentUserChange$.asObservable();
  }

  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(userProfile: UserProfile): void {
    this.currentUser = userProfile;
    this.currentUserChange$.next(userProfile);
  }

  async register(user: UserProfile): Promise<boolean> {
    let userDataFromGoogle: SocialUser = await this.getSocialAccountInfo();
    this.disposeSocialAccountInfo();
    if (await this.verifyUser(userDataFromGoogle.email)) return false;

    let userData: UserProfile = new UserProfile(userDataFromGoogle);
    userData.inst = user.inst;
    userData.status = user.status;

    let res: QueryResponse = await this.httpClient
      .post<any>(`${ this.API_URL }/users/registerUser`, userData)
      .toPromise();

    return res.isSuccess;
  }

  async signIn(): Promise<boolean> {
    let socialAccountInfo = await this.getSocialAccountInfo();
    if (await this.verifyUser(socialAccountInfo.email)) {
      this.setCurrentUser(await this.getUserProfile(socialAccountInfo.email));
      this.setToken(socialAccountInfo);
      return true;
    } else {
      this.disposeSocialAccountInfo();
      return false;
    }
  }

  signOut(): void {
    this.socialAuthService.signOut();
    localStorage.removeItem("KUBIC_TOKEN");
    this.setCurrentUser(null);
    this.router.navigateByUrl("/");
  }

  async getUserProfile(email: string): Promise<UserProfile> {
    let res: QueryResponse = await this.httpClient
      .post<any>(`${ this.API_URL }/users/getUserInfo`, {
        email: email,
        headers: this.headers,
      })
      .toPromise();
    return res.payload["userProfile"];
  }

  async verifyUser(email: string): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(`${ this.API_URL }/users/verifyUser`, { email: email })
      .toPromise();
    return res.payload["isRegistered"];
  }

  async verifySignIn(): Promise<boolean> {
    let token = this.getToken();
    if (token) {
      let verifyResult: QueryResponse = await this.verifyToken(token);
      if (verifyResult.isSuccess) this.setCurrentUser(verifyResult.payload["userProfile"]);
      return verifyResult.isSuccess;
    }
    return false;
  }

  async verifyToken(token: string): Promise<QueryResponse> {
    var client = this.PROVIDER_ID;
    return await this.httpClient
      .post<any>(`${ this.API_URL }/users/verifyToken`, {
        token: token,
        client: client,
      })
      .toPromise();
  }

  async apiRegister(): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.UPDATE_API_AUTH, { payload: this.currentUser.email })
      .toPromise();
    return res.isSuccess;
  }

  async getSocialAccountInfo(): Promise<SocialUser> {
    return await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  async disposeSocialAccountInfo(): Promise<void> {
    await this.socialAuthService.signOut();
  }

  getToken(): string {
    return localStorage.getItem("KUBIC_TOKEN");
  }

  setToken(userData: SocialUser) {
    localStorage.setItem("KUBIC_TOKEN", userData.idToken);
  }

  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  async deleteUser(): Promise<boolean> {

    let userDeleteRes: QueryResponse = await this.httpClient
      .post<any>(`${ this.API_URL }/users/deleteUser`, {
        email: this.currentUser.email,
      })
      .toPromise();
    let myDocDeleteRes: QueryResponse = await this.httpClient
      .post<any>(`${ this.API_URL }/myDoc/deleteAllMyDocs`, {
        userEmail: this.currentUser.email,
      })
      .toPromise();

    return (
      userDeleteRes.isSuccess === true && myDocDeleteRes.isSuccess === true
    );
  }
}
