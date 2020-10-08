/**
 * auth.service.ts
 * 역할 : email 과 google 두가지 종류의 auth의 공통된 기능을 담당하는 component
 * 로그인, 로그아웃, 토큰 확인, 검색어 저장 등...
 * 
 * 
 */

import { UserProfile, logStat} from "./user.model";
import {Auth} from "./userAuth.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IpService } from 'src/app/ip.service';
import { DocumentService } from "../../../homes/body/search/service/document/document.service";
import { AuthEmailService } from "./auth-email.service";
import { AuthGoogleService } from "./auth-google.service";
import {
  // AuthService,
  SocialUser,
  // GoogleLoginProvider,
} from "angularx-social-login";


// export abstract class Auth {
//   constructor() { }

//   abstract verifyToken(tk): Promise<any>;
//   abstract isOurUser(user): Promise<any>;

//   /**
//    * 
//    * @param user 로그인하는 유저. 구글의 경우 undefined
//    * @return 로그인 성공 했을 때 email인지 구글인지 어느 방식인지 반환
//    */
//   abstract logIn(user?): Promise<any>;

//   // logIn():Promise<any>;
//   abstract logOut(): void;
//   abstract getProfile(user);
//   // register():Promise<any>;
// }




// export class Profile {
//   registerStat: logStat;
//   email: string;
//   name: string;
//   token : string;
//   password?: string;

//   // nickname? : string;
//   inst?: string;
//   photo?: string;

//   constructor(name: string, email: string, token : string,reg: logStat, pw?: string, inst?, photo?) {
//     this.name = name;
//     this.password = pw;
//     this.email = email;
//     this.registerStat = reg;
//     this.token = token;
//     this.photo = photo;
//     this.inst = inst;
//   }

// }



@Injectable({
  providedIn: 'root'
})
export class EPAuthService {
  private JC: string = "jcnam@handong.edu";
  private BAEK: string = "21500850@handong.edu";
  private SONG: string = "21500831@handong.edu";
  protected URL = this.ipService.get_FE_DB_ServerIp();

  private SUPERUSER: string[] = [this.JC, this.BAEK, this.SONG]





  private KEEP_MY_DOC_URL = this.URL + "/myDoc/keepMyDoc";
  private GET_MY_DOC_URL = this.URL + "/myDoc/getMyDoc";
  private ERASE_ALL_MY_DOC = this.URL + "/myDoc/eraseAllDoc";
  private ADD_SEARCH_HISTORY_URL = this.URL + "/hst/addHistory";
  private SHOW_SEARCH_HISTORY_URL = this.URL + "/hst/showHistory";

  private isLogIn: logStat = logStat.unsigned;//for static, inactive, passive use
  private loginStatChange$: BehaviorSubject<logStat> = new BehaviorSubject(logStat.unsigned);//to stream to subscribers
  private loginUserData = {};
  private socUser: SocialUser = null;//for social login
  private userProfile : UserProfile = undefined;
  private auth: Auth = undefined;

  // private profile: {//for user profile
  //   name: String,
  //   email: String,
  //   history?: []
  // };
  private schHst: [] = [];//user search history
  private myDocs: [] = [];
  constructor(
    protected ipService: IpService,
    private http: HttpClient,
    private router: Router,
    // private gauth: AuthService,
    private docSvc: DocumentService,
    // private authFac : authFactory,
    private eAuth: AuthEmailService,
    private gAuth: AuthGoogleService,
    // private userProfile: UserProfile
  ) {
    // this.isLogInObs$.next(logStat.unsigned);
  }


  forceLogOut() {
    alert("강제로 로그아웃 합니다. 새로고침 해야 적용 됨.");
    localStorage.removeItem("token");
  }



  /**
   * @CommonUserLoginFunctions
   * @description common login process for all login methods such as email, gmail, ...  
   */
  //check login state
  getLoginStatChange(): Observable<logStat> {
    return this.loginStatChange$.asObservable();
  }

  getLogInStat(): logStat {
    return this.isLogIn;
  }
  setLogStat(stat) {
    this.loginStatChange$.next(stat as logStat)
    this.isLogIn = stat as logStat;
  }

  getUserName(): String {
    return this.userProfile.name;
  }

  //get current token in this present browser.
  getToken() {
    return localStorage.getItem("token");
  }

  // getNowUser(): SocialUser {
  //   return this.socUser;
  // }

  /**
   * 
   * 로그인 페이지에 각 버튼들이 있다. 정보를 누르고 나서 버튼을 누르면 해당 정보가 반영된 instance가 생성.
   * 
   * 
   */
  /**
   * @description factory method을 참조. factory class의 역할.
   * @param logStat 선택한 로그인 종류
   */
  // async logIn(logStat: string, user?) {
  //   if (logStat == "g")
  //     this.auth = this.eAuth;
  //   if (logStat == "e")
  //     this.auth = this.gAuth;
  //   let pf = await this.auth.logIn(user);
  //   if (pf) {
  //     this.confirmUser(pf);
  //   }

  // }




  // getLogInStatObs() {//return type be logStat
  //   // var stat;
  //   return new Promise((resolve)=>{
  //     this.isLogInObs$.subscribe((res)=>{
  //       resolve(res)
  //     })
  //   })//그리고 나서 then((r)=>this.stat = r; if(this.stat == ... ){ ...})
  //   // return this.isLogInObs$.toPromise().then((res)=>res as logStat);
  //   // return
  //   // console.log(stat)
  //   // return this.isLogIn;
  // }

  // async logOutObs(){
  //   var stat = await this.getLogInStatObs();
  //     if (stat == logStat.email)
  //     this.eLogoutUser()
  //     else if(stat == logStat.google)
  //     this.gSignOut();

  //     if(stat == logStat.unsigned)
  //     new Error("logStat screwed up. need to be checked.");//in case of screwed up
  //     this.isLogInObs$.next(logStat.unsigned)
  //     this.router.navigate(["/homes"]);
  // }




  //logout function for all login methods
  logOut() {
    this.auth.logOut()
    // if (this.isLogIn == logStat.email)
    // else if (this.isLogIn == logStat.google)
    // this.gSignOut();
    localStorage.removeItem("token");

    if (this.isLogIn == logStat.unsigned)
      new Error("logStat screwed up. need to be checked.");//in case of screwed up
    // this.isLogInObs$.next(logStat.unsigned)
    this.setLogStat(logStat.unsigned);
    this.router.navigate(["/homes"]);
  }


  //Check if this user has token, and if the token is valid.
  //called in the main home page.
  //When a user re-visit our app, should verify if token is valid
  // to decide the nav bar user name and user status.
  async verifySignIn() {
    var isSignIn: boolean = false;
    var tk_with_type = JSON.parse(this.getToken());//token is stored in string.
    console.log("auth service : token : ", tk_with_type);
    if (tk_with_type) {//when token exists
      var tk = tk_with_type.token;
      var type = tk_with_type.type;
      // console.log("Token found! : ", tk_with_type);


      /**
       * create instance or get instance using singlton pattern.
       */
      if(type == logStat.google){
        this.auth = this.gAuth.getInstance();

      }
      else if(type == logStat.email){
        this.auth = this.eAuth.getInstance();
        console.log("email mode")
      }



      var tkStat = await this.auth.verifyToken(tk);//verify it this token is valid or expired.
      // console.log(tkStat);
      if (tkStat.succ) {//if token is valid
        this.userProfile = new UserProfile(type,tkStat.payload.email, tkStat.payload.name, tk);
        // this.auth.getProfile(tkStat);
        // console.log("auth service : verifySignIn : userProfile : ", this.userProfile);
        let isSU = this.SUPERUSER.findIndex(i => {
          i == this.userProfile.name
        })
        if (isSU)
          type = logStat.SUPERUSER;
        this.setLogStat(type);

      }
      else {//toekn verify failed
        if (tkStat.msg == "expired") {
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          this.auth.logOut();
          this.router.navigate(['/homes']);
        }
      }
    }

   

    else {//when token does not exist.
      //console.log("token is not found. Hello, newbie!");
      //console.log("check the login stat as well : ", this.isLogIn);
      return isSignIn;
    }
  }















  /**
   * 
   * User history and documents features.
   * 
   */






  //검색내역 history 추가 
  addSrchHst(keyword: string): void {
    // //console.log(this.socUser);

    let bundle = { login: undefined, email: undefined, key: keyword }
    if (this.isLogIn) {
      console.log("add serach history : user is login.", this.userProfile)
      let userEmail = this.userProfile.email;
      bundle = { login: this.isLogIn, email: userEmail, key: keyword }
    }
        this.http.post<any>(this.ADD_SEARCH_HISTORY_URL, bundle).subscribe((res) => {
          console.log("history added raw result : ", res);
          this.schHst = res.history;
          console.log("personal history : ", this.schHst);
        });
    // else
      // console.log("비 로그인 상태")

  }

  async showSrchHst() {
    // var hst;
    if (this.isLogIn) {
      console.log("add serach history : user is login.", this.userProfile)
      let userEmail = this.userProfile.email;
      let bundle = { login: this.isLogIn, email: userEmail }

      let res = await this.http.post<any>(this.SHOW_SEARCH_HISTORY_URL, bundle).toPromise()
      console.log("show search hist : ", res);
      if (res.succ)
        return res.payload.map(h => h.keyword);
      else
        return ["아직 검색 기록이 없어요. 검색창에 키워드를 입력해보세요."]
    }
    else {
      console.log("비 로그인 상태")
      return Error;
    }
  }

  async addMyDoc(docIDs) {
    let payload = { userEmail: this.userProfile.email, docs: docIDs };
    //console.log("keep doc sending data : ", payload);
    let res = await this.http.post<any>(this.KEEP_MY_DOC_URL, payload).toPromise()
    this.myDocs = res.myDoc;

  }

  /**
   * @description 저장한 나의 문서의 제목을 호출한다.
   * @param isId 문서의 id를 같이 요구한다면 true
   * @return string array
   */
  async getMyDocs(isId?: boolean) {
    // console.log(this.idList);
    let idRes = await this.http.post<any>(this.GET_MY_DOC_URL, { payload: this.userProfile.email }).toPromise();

    idRes = idRes.payload;
    console.log("get my doc : ", idRes);

    if (idRes) {
      if (isId) {//when request id list
        let titles = await this.docSvc.convert_id_to_doc_title(idRes) as [];
        let i = -1;
        return titles.map(t => {
          i++
          return { title: t, id: idRes[i] }
        })
        // return 
      }
      else//when only requset titles
        return await this.docSvc.convert_id_to_doc_title(idRes)
    }
    else if (idRes == null)//when null => when no keep doc. 
      return null


  }

  async eraseAllMyDoc() {
    let res = await this.http.post<any>(this.ERASE_ALL_MY_DOC, { payload: this.userProfile.email }).toPromise()
    if (res.succ)
      alert("나의 문서를 모두 지웠어요.");
    else
      alert("문서 지우기에 실패했습니다. 관리자에게 문의해주세요.")
  }




}
