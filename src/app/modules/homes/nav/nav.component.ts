import { Component, AfterViewChecked, OnInit, OnChanges, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../communications/fe-backend-db/membership/auth.service';
import { HttpClient } from '@angular/common/http';
import { IpService } from 'src/app/ip.service'
import { navMenu, NavService } from './nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
})
export class NavComponent implements OnInit {
  private isApiUser: Boolean = false;
  private isSignedIn: Boolean = false;
  private selectedMenu: string = "";
  private userEmail: string;

  constructor(
    public router: Router,
    private authService: AuthService,
    private httpClient: HttpClient,
    private ipService: IpService,
    private navService: NavService,
  ) {
    this.authService.getCurrentUserChange().subscribe((user) => {
      if (user !== null) {
        this.isApiUser = user.isApiUser;
        this.isSignedIn = true;
        this.userEmail = user.email;
      }
      else {
        this.isSignedIn = false;
        this.isApiUser = false;
        this.userEmail = null;
      }
    });

    this.navService.getNavMenuChange().subscribe((menu) => {
      if (menu === navMenu.ABOUT) this.selectedMenu = 'about';
      else if (menu === navMenu.ANALYSIS) this.selectedMenu = 'analysis';
      else if (menu === navMenu.COMMUNITY) this.selectedMenu = 'community';
      else if (menu === navMenu.LIBRARY) this.selectedMenu = 'library';
      else if (menu === navMenu.LOGIN) this.selectedMenu = 'login';
      else if (menu === navMenu.MYPAGE) this.selectedMenu = 'myPage';
      else if (menu === navMenu.REGISTER) this.selectedMenu = 'register';
      else this.selectedMenu = "";
    })
  }
  ngOnInit(): void {

  }

  async logOut() {
    this.authService.signOut();
  }

  navigateSpecials(): void {
    this.router.navigateByUrl("/specials");
  }

  navigateLibrary(): void {
    this.router.navigateByUrl("/library");
  }

  toLogin(): void {
    this.router.navigateByUrl("/login");
  }

  toRegister(): void {
    this.router.navigateByUrl("/register");
  }


  toUserPage(): void {
    this.router.navigateByUrl("/userpage/my-docs");
  }

  toControl(): void {
    this.router.navigateByUrl("/control");
  }

  toCommunity(): void {
    this.router.navigateByUrl("/community/qna");
  }

  toAnnouncement(): void {
    this.router.navigateByUrl("/community/announcement");
  }

  toFaq(): void {
    this.router.navigateByUrl("/community/faq");
  }

  async toOpenApi(): Promise<void> {
    const dest = this.ipService.getFrontEndServerIP() + ':' + this.ipService.FLASK_PORT;
    console.log(dest);
    await this.httpClient.post(dest, { email: this.userEmail }, { responseType: 'text' }).toPromise().then((res) => {
      console.log(res);
      if (res) window.location.href = dest + "?K=" + res;
      else window.alert("잘못된 접근입니다.")
    });
  }

  toSiteIntro(): void {
    this.router.navigateByUrl("/introduce/intro");
  }

  toServiceGuide(): void {
    this.router.navigateByUrl("/introduce/service-guide");
  }

  toCollectedInfo(): void {
    this.router.navigateByUrl("/introduce/collected-info");
  }

  toMemberPolicy(): void {
    this.router.navigateByUrl("/introduce/member-policy");
  }
}




