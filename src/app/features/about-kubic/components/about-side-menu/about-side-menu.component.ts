import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-about-side-menu",
  templateUrl: "./about-side-menu.component.html",
  styleUrls: ["./about-side-menu.component.css"],
})
export class AboutSideMenuComponent implements OnInit {
  private _title: string = "";
  private _currentMenu: string = "";
  constructor(private router: Router) { }

  ngOnInit(): void {
    let url = this.router.url.split("/");
    this.currentMenu = url[url.length - 1];
    this.setTitle(this.currentMenu);
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
   * @description Set title according to current address 
   * @param currentAddress 
   */
  setTitle(currentAddress: string) {
    if (currentAddress === "intro") this.title = "홈페이지소개";
    if (currentAddress === "service-guide") this.title = "서비스안내";
    if (currentAddress === "collected-info") this.title = "수집정보";
    if (currentAddress === "member-policy") this.title = "회원정책";
  }

  toSiteIntro() {
    this.router.navigateByUrl("/about/intro");
    this.ngOnInit();
  }

  toServiceGuide() {
    this.router.navigateByUrl("/about/service-guide");
    this.ngOnInit();
  }

  toCollectedInfo() {
    this.router.navigateByUrl("/about/collected-info");
    this.ngOnInit();
  }

  toMemberPolicy() {
    this.router.navigateByUrl("/about/member-policy");
    this.ngOnInit();
  }

  public get currentMenu(): string {
    return this._currentMenu;
  }
  public set currentMenu(value: string) {
    this._currentMenu = value;
  }
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }
}
