import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-userpage-header',
  templateUrl: './userpage-header.component.html',
  styleUrls: ['./userpage-header.component.css']
})
export class UserpageHeaderComponent implements OnInit {

  private _currentMenu: string = "";

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentMenu = this.convertRouteToKor(this.router.url.split('/')[2]);
      }
    });
  }

  ngOnInit(): void {
    this.currentMenu = this.convertRouteToKor(this.router.url.split('/')[2]);
  }

  /**
   * @description Return route name to Korean 
   * @param routename 
   */
  convertRouteToKor(routename: string) {
    if (routename === "my-docs") return "내 보관함";
    if (routename === "my-analysis") return "내 분석함";
    if (routename === "secession") return "회원 탈퇴"
    if (routename === "member-info") return "회원 정보"
  }

  public get currentMenu(): string {
    return this._currentMenu;
  }
  public set currentMenu(value: string) {
    this._currentMenu = value;
  }

}
