import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { HttpClient } from "@angular/common/http";
import { IpService } from "src/app/core/services/ip-service/ip.service";
import {fromEvent, Observable, Subscription} from 'rxjs';

@Component({
  selector: "app-nav",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.less"],
})
export class NavbarComponent implements OnInit {
  private isApiUser: boolean = false;
  private isSignedIn: boolean = false;
  private selectedMenu: string = "";
  private selectedSubMenu : string = "";
  private userEmail: string;
  private isHamburger: boolean = false;
  private isDropdownCommunity: boolean = false;
  private isDropdownSiteInfo: boolean = false;
  private isDropdownUserpage: boolean = false;
  private _isFolderBtn: boolean = false;
  private mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    public router: Router,
    private authService: AuthenticationService,
    private httpClient: HttpClient,
    private ipService: IpService,
    private changeDetectorRef: ChangeDetectorRef,
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

    this.mobileQuery = matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }
  ngOnInit(): void {
    this.selectedMenu = this.router.url.split("/")[1];
    this.selectedSubMenu = this.router.url.split("/")[2];

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedMenu = event.url.split("/")[1];
        this.selectedSubMenu = event.url.split("/")[2];
      }
    });

    // this.resizeObservable$ = fromEvent(window, 'resize')
    // this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
    //   if(matchMedia("(max-width: 768px)").matches) {
    //     console.log('hihi');
    //   }
    //   console.log('event: ', evt);
    // });

    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  selectedStyleObject(flag: boolean): Object {
    if(matchMedia("(max-width: 768px)").matches) {
      if (flag) {
        return {
          color: "#0FBAFF",
          "font-weight": "bold",
        };
      } else {
        return {
          "background-color": "white",
        };
      }
    }else{
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
  }

  selectMobileMenu(): void {
    this.isHamburger = !this.isHamburger;
  }

  public get isSelectMobileMenu(): boolean {
    return this.isHamburger;
  }

  async logOut() {
    this.isHamburger = false;
    this.authService.signOut();
  }

  navigateSpecials(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/analysis");
  }

  navigateLibrary(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/library");
  }

  toLogin(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/login");
  }

  toRegister(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/register");
  }

  toUserPage(): void {
    this.router.navigateByUrl("/userpage");
  }

  toControl(): void {
    this.router.navigateByUrl("/control");
  }

  toCommunity(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/community/qna");
  }

  clickDropDownCommunity(): void {
    this.isDropdownSiteInfo = false;
    this.isDropdownUserpage = false;
    this.isDropdownCommunity = !this.isDropdownCommunity;
  }

  public get isDropDownCommunity(): boolean {
    return this.isDropdownCommunity;
  }

  clickDropDownSiteInfo(): void {
    this.isDropdownCommunity = false;
    this.isDropdownUserpage = false;
    this.isDropdownSiteInfo = !this.isDropdownSiteInfo;
  }

  public get isDropDownSiteInfo(): boolean {
    return this.isDropdownSiteInfo;
  }

  toAnnouncement(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/community/announcement");
  }

  toFaq(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/community/faq");
  }

  /**
   * @description router to api register page in userpage
   */
  toOpenAPI() {
    this.isHamburger = false;

    if (this.authService.getCurrentUser().isApiUser) {
      this.toOpenApi();
    }
    else {
      this.router.navigateByUrl("/api-register");
    }
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
    this.isHamburger = false;
    this.router.navigateByUrl("/about/intro");
  }

  toServiceGuide(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/about/service-guide");
  }

  toCollectedInfo(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/about/collected-info");
  }

  toMemberPolicy(): void {
    this.isHamburger = false;
    this.router.navigateByUrl("/about/member-policy");

  toManagement(): void {
    this.router.navigateByUrl("/openapi/management");
  }

  toDocument(): void {
    this.router.navigateByUrl("/openapi/document");
  }

  toGotoapi(): void {
    this.router.navigateByUrl("/openapi/gotoapi");
  }

  getSelectedMenu(): string {
    return this.selectedMenu;
  }

  getSelectedSubMenu(): string {
    return this.selectedSubMenu;
  }

  getIsApiUser(): boolean {
    return this.isApiUser;
  }

  getIsSignedIn(): boolean {
    return this.isSignedIn;
  }

  clickDropDownUserpage(): void {
    this.isDropdownSiteInfo = false;
    this.isDropdownCommunity = false;
    this.isDropdownUserpage = !this.isDropdownUserpage;
  }

  public get isDropDownUserpage(): boolean {
    return this.isDropdownUserpage;
  }

  /**
   * @description router to my-docs in user page
   */
  toMyDocs() {
    this.isHamburger = false;
    this.router.navigateByUrl("/userpage/my-docs");
  }

  /**
   * @description router to my-analysis in user page
   */
  toMyAnalysis() {
    this.isHamburger = false;
    this.router.navigateByUrl("/userpage/my-analysis");
  }

  /**
   * @description router to member-info in user page
   */
  toMemberInfo() {
    this.isHamburger = false;
    this.router.navigateByUrl("/userpage/member-info");
  }

  /**
   * @description router to secession page in userpage
   */
  toSecession() {
    this.isHamburger = false;
    this.router.navigateByUrl("/userpage/secession");
  }

}

