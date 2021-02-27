import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-community-board",
  templateUrl: "./community.board.component.html",
  styleUrls: ["./community.board.component.less"],
})
export class CommunityBoardComponent implements OnInit {
  private _selectedMenu: string = this.router.url.split("/")[2];

  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        this.selectedMenu = this.router.url.split("/")[2];
      }
    })
  }

  ngOnInit() { }

  /**
   * @description Navigate to qna page.
   */
  navToQna(): void {
    this.router.navigateByUrl("community/qna");
  }

  /**
   * @description Navigate to announcement page.
   */
  navToAnnouncement(): void {
    this.router.navigateByUrl("community/announcement");
  }

  /**
   * @description Navigate to faq page.
   */
  navToFaq(): void {
    this.router.navigateByUrl("community/faq");
  }

  /**
   * @description Check current route and hide community board navigation bar if it is not needed
   */
  isNavbarNeeded(): boolean {
    return !(this.router.url.includes('new') || this.router.url.includes('read') || this.router.url.includes('modify'))
  }

  // getters and setters
  public get selectedMenu(): string {
    return this._selectedMenu;
  }
  public set selectedMenu(value: string) {
    this._selectedMenu = value;
  }
}
