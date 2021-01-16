import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-community-root',
  templateUrl: './community-root.component.html',
  styleUrls: ['./community-root.component.less']
})
export class CommunityRootComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
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

  navToCmm() {
    this.router.navigateByUrl("community/qna");

  }

  navToAnounce() {
    this.router.navigateByUrl("community/announcement");

  }

  navToFaq() {
    this.router.navigateByUrl("community/faq");
  
  }

}
