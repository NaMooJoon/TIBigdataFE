import { Component, AfterViewChecked, OnInit, OnChanges, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { EPAuthService } from '../../communications/fe-backend-db/membership/auth.service';
// import { LoginComponent} from '../../core/componets/membership/login/login.component';
import { UserpageComponent } from '../body/membership/userpage/userpage.component';
import { SocialUser, SocialAuthService } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { IpService } from 'src/app/ip.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  // providers:[LoginComponent]
})
export class NavComponent implements OnInit {

  private nowUser: String = null;
  private isApiUser: Boolean = false;
  private isSignedIn: Boolean = false;
  private selectedMenu: String = "";

  constructor(
    public _router: Router,
    private auth: EPAuthService,
    private _http: HttpClient,
    private _ipService: IpService,
  ) {
    this.auth.getLoginStatChange().subscribe(async (logInStat) => {
      console.log("logstat : " + logInStat);
      if (logInStat > 1) {
        this.nowUser = this.auth.getUserName();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.isSignedIn = await this.auth.verifySignIn();
    this.setApiStat();
    this.auth.getLoginStatChange().subscribe(async (logInStat) => {
      console.log("logstat : " + logInStat);
      if (logInStat > 1) {
        this.nowUser = this.auth.getUserName();
      }
    });
  }

  async logOut() {
    console.log("logout func init");
    await this.auth.logOut();
    this.ngOnInit();
  }

  setApiStat(): void {
    if (this.isSignedIn) {
      this.isApiUser = this.auth.getApiStat();
    }
    else {
      this.isApiUser = false;
    }
  }

  setColor(menu: string): string {
    if (this.selectedMenu === menu) {
      return "red";
    }
    else {
      return "";
    }
  }

  ready() {
    alert("준비중입니다");
  }
  //routers
  navigateSpecials() {
    this._router.navigateByUrl("/specials");
  }

  navigateParser() {
    this._router.navigateByUrl("/flask");
  }

  navigateLibrary() {
    this._router.navigateByUrl("/library");
    this.selectedMenu = "library"
  }

  navigateQT() {
    this._router.navigateByUrl("/querytest");
  }

  LineChart() {
    this._router.navigateByUrl("/line-chart");
  }

  toFlask() {
    this._router.navigateByUrl("/flask");
  }

  toHomes() {
    this._router.navigateByUrl("/homes");
  }

  toLogin() {
    this._router.navigateByUrl("/login");
  }
  ///../core/componetsmembership/login
  toRegister() {
    // console.log("in the toReg func")
    this._router.navigateByUrl("/register");
  }

  toEvent() {
    this._router.navigateByUrl("/event");
  }

  toUserPage() {
    this._router.navigateByUrl("/userpage");
  }

  toControl() {
    this._router.navigateByUrl("/control");
  }

  toCommunity() {
    this._router.navigateByUrl("/community/qna")
  }

  toAnnouncement() {
    this._router.navigateByUrl("/community/announcement");
  }

  toFaq() {
    this._router.navigateByUrl("/community/faq");
  }

  toOpenApi() { }

  toSiteIntro() {
    this._router.navigateByUrl("/introduce/intro");
  }

  toServiceGuide() {
    this._router.navigateByUrl("/introduce/service-guide");
  }

  toCollectedInfo() {
    this._router.navigateByUrl("/introduce/collected-info");
  }

  toMemberPolicy() {
    this._router.navigateByUrl("/introduce/member-policy");
  }

}




