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
  private selectedMenu: string = "";

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
    this.authService.signOut();
    this.ngOnInit();
  }

  navigateSpecials() {
    this.router.navigateByUrl("/specials");
    this.selectedMenu = "analysis";
  }

  navigateLibrary() {
    this.router.navigateByUrl("/library");
    this.selectedMenu = "library";
  }

  toLogin() {
    this.router.navigateByUrl("/login");
    this.selectedMenu = "login";
  }

  toRegister() {
    this.router.navigateByUrl("/register");
    this.selectedMenu = "register";
  }


  toUserPage() {
    this.router.navigateByUrl("/userpage/my-docs");
    this.selectedMenu = "myPage";
  }

  toControl() {
    this.router.navigateByUrl("/control");
  }

  toCommunity() {
    this.router.navigateByUrl("/community/qna");
    this.selectedMenu = "community";
  }

  toAnnouncement() {
    this.router.navigateByUrl("/community/announcement");
    this.selectedMenu = "community";
  }

  toFaq() {
    this.router.navigateByUrl("/community/faq");
    this.selectedMenu = "community";
  }

  toOpenApi() { }

  toSiteIntro() {
    this.router.navigateByUrl("/introduce/intro");
    this.selectedMenu = "intro";
  }

  toServiceGuide() {
    this.router.navigateByUrl("/introduce/service-guide");
    this.selectedMenu = "intro";
  }

  toCollectedInfo() {
    this.router.navigateByUrl("/introduce/collected-info");
    this.selectedMenu = "intro";
  }

  toMemberPolicy() {
    this.router.navigateByUrl("/introduce/member-policy");
    this.selectedMenu = "intro";
  }

}




