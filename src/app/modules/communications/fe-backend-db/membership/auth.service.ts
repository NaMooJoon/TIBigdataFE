import { UserProfile, logStat } from "./user.model";
import { Auth } from "./userAuth.model";
import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NavigationEnd, Router } from "@angular/router";
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IpService } from 'src/app/ip.service';
import { DocumentService } from "../../../homes/body/search/service/document/document.service";
import { AuthEmailService } from "./auth-email.service";
import { AuthGoogleService } from "./auth-google.service";
import { SocialUser } from "angularx-social-login";


@Injectable({
  providedIn: 'root'
})
export class EPAuthService {
  private JC: string = "jcnam@handong.edu";
  private BAEK: string = "21500850@handong.edu";
  private SONG: string = "21500831@handong.edu";
  protected URL = this.ipService.getFrontDBServerIp();

  private SUPERUSER: string[] = [this.JC, this.BAEK, this.SONG]

  private KEEP_MY_DOC_URL = this.URL + "/myDoc/keepMyDoc";
  private GET_MY_DOC_URL = this.URL + "/myDoc/getMyDoc";
  private ERASE_ALL_MY_DOC = this.URL + "/myDoc/eraseAllDoc";
  private ADD_SEARCH_HISTORY_URL = this.URL + "/hst/addHistory";
  private SHOW_SEARCH_HISTORY_URL = this.URL + "/hst/showHistory";
  private UPDATE_API_AUTH = this.URL + "/eUser/apiRegister";

  private isLogIn: logStat = logStat.unsigned;//for static, inactive, passive use
  private loginStatChange$: BehaviorSubject<logStat> = new BehaviorSubject(logStat.unsigned);//to stream to subscribers
  private loginUserData = {};
  private socUser: SocialUser = null;//for social login
  private userProfile: UserProfile = undefined;
  private auth: Auth = undefined;

  private schHst: [] = [];//user search history
  private myDocs: [] = [];
  constructor(
    protected ipService: IpService,
    private http: HttpClient,
    private router: Router,
    private docSvc: DocumentService,
    private eAuth: AuthEmailService,
    private gAuth: AuthGoogleService,
  ) {
  }

  forceLogOut() {
    alert("강제로 로그아웃 합니다. 새로고침 해야 적용 됨.");
    localStorage.removeItem("token");
  }

  getLoginStatChange(): Observable<logStat> {
    return this.loginStatChange$.asObservable();
  }

  getLogInStat(): logStat {
    return this.isLogIn;
  }

  setLogStat(stat: logStat) {
    this.loginStatChange$.next(stat as logStat)
    this.isLogIn = stat as logStat;
  }

  getUserName(): String {
    return this.userProfile.name;
  }

  getAuthType(): logStat {
    return this.userProfile.registerStat;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getApiStat(): Boolean {
    return this.userProfile.api;
  }

  getUserEmail(): String {
    return this.userProfile.email;
  }

  async logOut() {
    this.auth.logOut()
    localStorage.removeItem("token");

    if (this.isLogIn == logStat.unsigned) {
      new Error("logStat screwed up. need to be checked.");//in case of screwed up
    }
    this.setLogStat(logStat.unsigned);
    this.router.navigate(["/homes"]);
  }

  async verifySignIn(): Promise<Boolean> {
    let tk_with_type = JSON.parse(this.getToken());//token is stored in string.
    if (tk_with_type) {//when token exists
      let tk = tk_with_type.token;
      let type = tk_with_type.type;

      if (type == logStat.google) {
        this.auth = this.gAuth.getInstance();

      }
      else if (type == logStat.email) {
        this.auth = this.eAuth.getInstance();
      }

      let tkStat = await this.auth.verifyToken(tk);//verify it this token is valid or expired.
      if (tkStat.succ) {
        this.userProfile = new UserProfile(type, tkStat.payload.user.email, tkStat.payload.user.name, tkStat.payload.user.nickname, tkStat.payload.user.inst, tkStat.payload.user.api, tk);
        console.log("set stat after verifying: " + type);
        this.setLogStat(type);
        console.log(this.userProfile);
        let isSU = this.SUPERUSER.findIndex(i => {
          i == this.userProfile.name
        })
        if (isSU)
          type = logStat.SUPERUSER;

        return true;
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
      return false;
    }
  }

  //검색내역 history 추가 
  addSrchHst(keyword: string): void {
    let bundle = { login: undefined, email: undefined, key: keyword }
    if (this.isLogIn) {
      let userEmail = this.userProfile.email;
      bundle = { login: this.isLogIn, email: userEmail, key: keyword }
    }
    this.http.post<any>(this.ADD_SEARCH_HISTORY_URL, bundle).subscribe((res) => {
      this.schHst = res.history;
    });
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
  
    let idRes = await this.http.post<any>(this.GET_MY_DOC_URL, { payload: this.userProfile.email }).toPromise();
    console.log("idRes: ", idRes);
    
    if (idRes.succ === false) {
      let payload = { userEmail: this.userProfile.email, docs: docIDs };
      let res = await this.http.post<any>(this.KEEP_MY_DOC_URL, payload).toPromise()
      this.myDocs = res.myDoc;
      return;
    }

    for (var i=0; i<idRes.payload.length; i++) {
      for (var j=0; j<docIDs.length; j++) {
        if (idRes.payload[i] === docIDs[j]) {
          docIDs.splice(j, 1);
        }
      }
    }

    let payload = { userEmail: this.userProfile.email, docs: docIDs };
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
    let res = await this.http.post<any>(this.ERASE_ALL_MY_DOC, { payload: this.userProfile.email }).toPromise();
    if (res.succ)
      alert("나의 문서를 모두 지웠어요.");
    else
      alert("문서 지우기에 실패했습니다. 관리자에게 문의해주세요.")
  }

  async apiRegister() {
    let res = await this.http.post<any>(this.UPDATE_API_AUTH, { payload: this.userProfile.email }).toPromise();
    if (res.succ) {
      alert("회원가입이 완료되었습니다! API 키 발급페이지로 이동합니다.");
    }
    else {
      alert("잘못된 접근입니다. 로그인이 되어 있는지 확인해주세요.");
      this.router.navigateByUrl("/login");
    }
  }
}
