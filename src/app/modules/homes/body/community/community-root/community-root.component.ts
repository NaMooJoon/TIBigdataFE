import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { boardMenu, CommunityService } from '../community-services/community.service';

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.less']
})

export class CommunityRootComponent implements OnInit {

  constructor(
    private router: Router,
    private cmService: CommunityService,
    private cdRef: ChangeDetectorRef) { }
  private selectedMenu: boardMenu;

  ngOnInit() {

  }

  ngAfterViewInit() {

    this.cmService.getBoardMenuChange().subscribe(menu => {
      this.selectedMenu = menu;
      this.cdRef.detectChanges();
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
