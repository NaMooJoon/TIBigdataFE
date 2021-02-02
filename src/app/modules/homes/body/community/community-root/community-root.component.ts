import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

export enum MENU { ANNCMNT, QNA, FAQ };

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.less']
})

export class CommunityRootComponent implements OnInit {

  constructor(private router: Router) { }
  private selectedMenu: MENU;

  ngOnInit() {
    this.selectedMenu = MENU.ANNCMNT;
  }
  /**
   * 
   * 새 컴포넌트
   * 글 제목
   *  property title
   * 글 내용
   *  property content
   * 저장
   *  저장하는 함수
   * 취소
   *  취소하는 함수
  */



  navToQna() {
    this.selectedMenu = MENU.QNA;
    this.router.navigateByUrl("community/qna");
  }

  navToAnnouncement() {
    this.selectedMenu = MENU.ANNCMNT;
    this.router.navigateByUrl("community/announcement");

  }

  navToFaq() {
    this.selectedMenu = MENU.FAQ;
    this.router.navigateByUrl("community/faq");
  }

  public get menu(): typeof MENU {
    return MENU
  }
}
