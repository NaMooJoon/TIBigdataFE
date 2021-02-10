import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Res } from "../res.model";
import { UserProfile } from "./user.model";
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
// import { PROVIDER_ID } from "../../communication.module";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL: string = 'http://localhost:14000';
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private currentUserChange$: BehaviorSubject<UserProfile> = new BehaviorSubject(null);
  private currentUser: UserProfile;
  private isLoggedIn: boolean;
  private UPDATE_API_AUTH = this.API_URL + "/users/apiRegister";
  private GOOGLE_VERIFY_TOKEN_URL = this.API_URL + "/users/verifyToken";
  private PROVIDER_ID: string = "576807286455-35sjp2v8leqpfeg3qj7k2rfr3avns7a5.apps.googleusercontent.com";

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    private socialAuthService: SocialAuthService,
  ) {
    this.currentUserChange$.subscribe((currentUser: UserProfile) => {
      this.isLoggedIn = (currentUser != null);
    });
  }

  getCurrentUserChange(): Observable<UserProfile> {
    return this.currentUserChange$.asObservable();
  }

  setCurrentUser(userProfile: UserProfile): void {
    this.currentUserChange$.next(userProfile);
  }

  async register(user: UserProfile): Promise<boolean> {
    let userDataFromGoogle: SocialUser = await this.getSocialAccountInfo();
    this.disposeSocialAccountInfo();
    if (await this.verifyUser(userDataFromGoogle.email)) return false;

    let userData: UserProfile = new UserProfile(userDataFromGoogle);
    userData.inst = user.inst;
    userData.status = user.status;

    let res: Res = await this.httpClient.post<any>(`${this.API_URL}/users/registerUser`, userData).toPromise();

    return res.succ;
  }

  async signIn(): Promise<boolean> {
    let socialAccountInfo = await this.getSocialAccountInfo();
    if (await this.verifyUser(socialAccountInfo.email)) {
      this.setCurrentUser(await this.getUserProfile(socialAccountInfo.email));
      this.setToken(socialAccountInfo);
      return true;
    }
    else {
      this.disposeSocialAccountInfo();
      return false;
    }
  }

  signOut(): void {
    this.socialAuthService.signOut();
    localStorage.removeItem("KUBIC_TOKEN");
    this.setCurrentUser(null);
    this.router.navigateByUrl('/');
  }

  async getUserProfile(email: string): Promise<UserProfile> {
    let res: Res = await this.httpClient.post<any>(`${this.API_URL}/users/getUserInfo`, { 'email': email, headers: this.headers }).toPromise();
    return res.payload['userProfile'];
  }

  async verifyUser(email: string): Promise<boolean> {
    let res: Res = await this.httpClient.post<any>(`${this.API_URL}/users/verifyUser`, { 'email': email }).toPromise();
    return res.payload['isRegistered'];
  }

  async verifySignIn(): Promise<void> {
    let token = this.getToken();
    if (token) {
      let verifyResult: Res = await this.verifyToken(token);
      if (verifyResult.succ) {
        console.log(verifyResult.payload)
        this.setCurrentUser(verifyResult.payload['userProfile']);
      }
      else {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        this.signOut();
        this.router.navigate(['/homes']);
      }
    }
  }

  async verifyToken(token: string): Promise<Res> {
    var client = this.PROVIDER_ID
    return await this.httpClient.post<any>(`${this.API_URL}/users/verifyToken`, { token: token, client: client }).toPromise();
  }

  async apiRegister(): Promise<boolean> {
    let res: Res = await this.httpClient.post<any>(this.UPDATE_API_AUTH, { payload: this.currentUser.email }).toPromise();
    return res.succ;
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
}
