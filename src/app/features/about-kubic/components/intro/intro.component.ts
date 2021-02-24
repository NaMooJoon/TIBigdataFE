import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-intro",
  templateUrl: "./intro.component.html",
  styleUrls: ["./intro.component.less"],
})
export class IntroComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  /**
   * @description Router to intro page
   */
  toSiteIntro() {
    this.router.navigateByUrl("/introduce/intro");
  }

  /**
   * @description Router to service guide page 
   */
  toServiceGuide() {
    this.router.navigateByUrl("/introduce/service-guide");
  }

  /**
   * @description Router to collected info page 
   */
  toCollectedInfo() {
    this.router.navigateByUrl("/introduce/collected-info");
  }

  /**
   * @description Router to member policy page 
   */
  toMemberPolicy() {
    this.router.navigateByUrl("/introduce/member-policy");
  }
}
