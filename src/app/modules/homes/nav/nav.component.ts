import { Component, AfterViewChecked, OnInit, OnChanges, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../communications/fe-backend-db/membership/auth.service';
import { HttpClient } from '@angular/common/http';
import { IpService } from 'src/app/ip.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
})
export class NavComponent implements OnInit {
  private isApiUser: Boolean = false;
  private isSignedIn: Boolean = false;
  private selectedMenu: String = "";

  constructor(
    public router: Router,
    private authService: AuthService,
    private httpClient: HttpClient,
    private ipService: IpService,
  ) {
    this.authService.getCurrentUserChange().subscribe((user) => {
      if (user !== null) {
        this.isApiUser = user.isApiUser;
        this.isSignedIn = true;
      }
      else {
        this.isSignedIn = false;
      }

      console.log('signedin = ', this.isSignedIn);
    });
  }

  ngOnInit() {
  }

  async logOut() {
    console.log("logout func init");
    await this.authService.signOut();
    this.ngOnInit();
  }

  navigateSpecials() {
    this.router.navigateByUrl("/specials");
  }

  navigateParser() {
    this.router.navigateByUrl("/flask");
  }

  navigateLibrary() {
    this.router.navigateByUrl("/library");
    this.selectedMenu = "library"
  }

  navigateQT() {
    this.router.navigateByUrl("/querytest");
  }

  LineChart() {
    this.router.navigateByUrl("/line-chart");
  }

  toFlask() {
    this.router.navigateByUrl("/flask");
  }

  toHomes() {
    this.router.navigateByUrl("/homes");
  }

  toLogin() {
    this.router.navigateByUrl("/login");
  }
  ///../core/componetsmembership/login
  toRegister() {
    // console.log("in the toReg func")
    this.router.navigateByUrl("/register");
  }

  toEvent() {
    this.router.navigateByUrl("/event");
  }

  toUserPage() {
    this.router.navigateByUrl("/userpage/my-docs");
  }

  toControl() {
    this.router.navigateByUrl("/control");
  }

  toCommunity() {
    this.router.navigateByUrl("/community/qna")
  }

  toAnnouncement() {
    this.router.navigateByUrl("/community/announcement");
  }

  toFaq() {
    this.router.navigateByUrl("/community/faq");
  }

  toOpenApi() { }

  toSiteIntro() {
    this.router.navigateByUrl("/introduce/intro");
  }

  toServiceGuide() {
    this.router.navigateByUrl("/introduce/service-guide");
  }

  toCollectedInfo() {
    this.router.navigateByUrl("/introduce/collected-info");
  }

  toMemberPolicy() {
    this.router.navigateByUrl("/introduce/member-policy");
  }

}




