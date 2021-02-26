import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication-service/authentication.service';
import { IpService } from 'src/app/core/services/ip-service/ip.service';

@Component({
  selector: 'app-userpage-sidebar',
  templateUrl: './userpage-sidebar.component.html',
  styleUrls: ['./userpage-sidebar.component.css']
})
export class UserpageSidebarComponent implements OnInit {
  private _title: string = "";
  private _currentMenu: string = "";

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private ipService: IpService,
    private httpClient: HttpClient,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentMenu = this.router.url.split('/')[2];
      }
    });
  }

  ngOnInit(): void {
    let url = this.router.url.split("/");
    this.currentMenu = url[url.length - 1];
  }

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        color: "#0FBAFF",
        "font-weight": "bold",
      };
    } else {
      return {
        color: "black",
        "background-color": "white",
      };
    }
  }
  /**
     * @description router to my-docs in user page  
     */
  toMyDocs() {
    this.router.navigateByUrl("/userpage/my-docs");
  }

  /**
   * @description router to my-analysis in user page 
   */
  toMyAnalysis() {
    this.router.navigateByUrl("/userpage/my-analysis");
  }

  /**
   * @description router to member-info in user page 
   */
  toMemberInfo() {
    this.router.navigateByUrl("/userpage/member-info");
  }

  /**
   * @description router to api register page in userpage 
   */
  toOpenAPI() {
    if (this.authenticationService.getCurrentUser().isApiUser) {
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
      .post(dest, { email: this.authenticationService.getCurrentUser().email }, { responseType: "text" })
      .toPromise()
      .then((res) => {

        if (res) window.location.href = dest + "?K=" + res;
        else window.alert("잘못된 접근입니다.");
      });
  }

  /**
   * @description router to secession page in userpage 
   */
  toSecession() {
    this.router.navigateByUrl("/userpage/secession");
  }

  // getters and setters
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
  public get currentMenu(): string {
    return this._currentMenu;
  }
  public set currentMenu(value: string) {
    this._currentMenu = value;
  }
}
