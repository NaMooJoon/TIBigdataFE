import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { HttpClient } from "@angular/common/http";
import { IpService } from "src/app/core/services/ip-service/ip.service";

@Component({
  selector: "app-nav",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.less"],
})
export class NavbarComponent implements OnInit {
  private isApiUser: boolean = false;
  private isSignedIn: boolean = false;
  private selectedMenu: string = "";
  private userEmail: string;

  constructor(
    public router: Router,
    private authService: AuthenticationService,
    private httpClient: HttpClient,
    private ipService: IpService
  ) {
    // subscriber to get user infomation 
    this.authService.getCurrentUserChange().subscribe((user) => {
      if (user !== null) {
        this.isApiUser = user.isApiUser;
        this.isSignedIn = true;
        this.userEmail = user.email;
      } else {
        this.isSignedIn = false;
        this.isApiUser = false;
        this.userEmail = null;
      }
    });
  }
  ngOnInit(): void {
    this.selectedMenu = this.router.url.split("/")[1];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedMenu = event.url.split("/")[1];
      }
    });
  }

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        color: "white",
        "background-color": "#52b9ff",
      };
    } else {
      return {
        color: "black",
        "background-color": "transparent",
      };
    }
  }

  async logOut() {
    this.authService.signOut();
  }

  navigateSpecials(): void {
    this.router.navigateByUrl("/analysis");
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
    this.router.navigateByUrl("/userpage");
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
    const dest =
      this.ipService.getFrontEndServerIP() + ":" + this.ipService.FLASK_PORT;

    await this.httpClient
      .post(dest, { email: this.userEmail }, { responseType: "text" })
      .toPromise()
      .then((res) => {

        if (res) window.location.href = dest + "?K=" + res;
        else window.alert("잘못된 접근입니다.");
      });
  }

  toSiteIntro(): void {
    this.router.navigateByUrl("/about/intro");
  }

  toServiceGuide(): void {
    this.router.navigateByUrl("/about/service-guide");
  }

  toCollectedInfo(): void {
    this.router.navigateByUrl("/about/collected-info");
  }

  toMemberPolicy(): void {
    this.router.navigateByUrl("/about/member-policy");
  }

  getSelectedMenu(): string {
    return this.selectedMenu;
  }

  getIsApiUser(): boolean {
    return this.isApiUser;
  }

  getIsSignedIn(): boolean {
    return this.isSignedIn;
  }
}
