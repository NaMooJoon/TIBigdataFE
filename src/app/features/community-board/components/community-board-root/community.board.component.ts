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

  navToQna() {
    this.router.navigateByUrl("community/qna");
  }

  navToAnnouncement() {
    this.router.navigateByUrl("community/announcement");
  }

  navToFaq() {
    this.router.navigateByUrl("community/faq");
  }

  isNavbarNeeded() {
    return !(this.router.url.includes('new') || this.router.url.includes('read') || this.router.url.includes('modify'))
  }

  public get selectedMenu(): string {
    return this._selectedMenu;
  }
  public set selectedMenu(value: string) {
    this._selectedMenu = value;
  }
}
