import { Component, OnInit } from '@angular/core';
import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { Router } from '@angular/router';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { LoginComponent } from '../login/login.component';
import { HttpClient } from "@angular/common/http";
import { IpService } from 'src/app/ip.service'
import { IdControlService } from "../../search/service/id-control-service/id-control.service";

// enum user_menu{
//   my_keep,
//   my_analysis,
//   my_history,
//   my_account,
//   sign_out
// }

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.less'],
  providers: [LoginComponent]
})
export class UserpageComponent implements OnInit {

  private nowUser: SocialUser;
  private myDocs: string[] = [];
  // private myDocsNum : Number;
  private myHst: string[] = [];
  private isDocEmpty: boolean = false;
  private user_menu: string = "my_keep";


  constructor(
    private http: HttpClient,
    private ipService: IpService,
    private idSvs: IdControlService,
    public _router: Router,
    private _auth: EPAuthService,
    private _login: LoginComponent,
    private _gauth: SocialAuthService
  ) { }

  ngOnInit() {
    this._auth.getLoginStatChange().subscribe((logstat) => {
      this.getKeepDocs();
      this.getMyHst()
    });
  }

  user_menu_set(event: string) {
    console.log("menu : ", event)
    this.user_menu = event;
  }

  gSignOut() {
    this._gauth.signOut();
  }
  showCookie() {
    alert(document.cookie);
  }

  changeCookie() {
    document.cookie = 'same-site-cookie=foo; SameSite=Lax';
    document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
    alert(document.cookie);
  }

  async getKeepDocs() {
    console.log("Getkeep odcs init")
    this.myDocs = await this._auth.getMyDocs() as string[];
    console.log(this.myDocs)
    if (this.myDocs == null) {
      this.isDocEmpty = true;
      this.myDocs = ["저장한 문서가 없어요. 검색 후 문서를 저장해보세요."];
    }
    // console.log(typeof(this.myDocs))
    // console.log(this.myDocs.length)
    // this.myDocsNum = this.myDocs.length;
  }

  deleteAllMyDocs() {
    console.log("문서 지우기")
    this._auth.eraseAllMyDoc().then(
      () => this.getKeepDocs()
    );

  }

  async apiTest() {
    const dest = this.ipService.getFrontEndServerIP() + ':' + this.ipService.FLASK_PORT;
    console.log(dest);
    await this.http.post(dest, { email: this._auth.getUserEmail() }, { responseType: 'text' }).toPromise().then((res) => {
      console.log(res);
      if (res) window.location.href = dest + "?K=" + res;
      else window.alert("잘못된 접근입니다.")
    });
  }

  async getMyHst() {
    console.log("getmyHst init")
    this.myHst = await this._auth.showSrchHst();
    console.log("my hist: ", this.myHst);
  }

  toApiReg(): void {
    this._router.navigateByUrl("/api-register");
  }

  // //dashboard ts에도 동일한 함수 있음. 차후 idList ts으로 이동하여 합침. 
  // async convertID2Title() {
  //   this.idList = await this.auth.getMyDocs() as string[];
  //   return new Promise((resolve) => {
  //     this.es.searchByManyId(this.idList).then(res => {
  //       console.log(res);
  //       let articles = res["hits"]["hits"];
  //       for (let i = 0; i < articles.length; i++) {
  //         this.myDocsTitles[i] = articles[i]["_source"]["post_title"][0]
  //       }
  //     })
  //     resolve();
  //     // this.http.post<any>()
  //   })
  // }

}
