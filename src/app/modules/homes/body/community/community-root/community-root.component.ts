import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { navMenu, NavService } from '../../../nav/nav.service';
import { boardMenu, CommunityService } from '../community-services/community.service';

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.less']
})

export class CommunityRootComponent implements OnInit {
  private selectedMenu: boardMenu;

  constructor(
    private router: Router,
    private cmService: CommunityService,
    private navService: NavService,
  ) { }

  ngOnInit() {
    this.navService.setNavMenu(navMenu.COMMUNITY);
  }

  ngAfterViewInit() {
    this.cmService.getBoardMenuChange().subscribe(menu => {
      setTimeout(() => {
        this.selectedMenu = menu;
      });
    });
  }

  navToQna() {
    this.router.navigateByUrl("community/qna");
  }

  navToAnnouncement() {
    this.router.navigateByUrl("community/announcement");
  }

  navToFaq() {
    this.router.navigateByUrl("community/faq");
  }

  public get menu(): typeof boardMenu {
    return boardMenu
  }
}
