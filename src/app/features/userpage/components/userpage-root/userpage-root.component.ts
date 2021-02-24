import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-userpage-root',
  templateUrl: './userpage-root.component.html',
  styleUrls: ['./userpage-root.component.less']
})
export class UserpageRootComponent implements OnInit {
  private where: String;

  constructor(
    public router: Router,
    // private navService: NavService,
  ) { }

  ngOnInit(): void {
    this.where = "내 보관함";
    // this.navService.setNavMenu(navMenu.MYPAGE);
    this.router.navigateByUrl("/userpage/my-docs");
  }

  /**
   * @description router to my-docs in user page  
   */
  toMyDocs() {
    this.router.navigateByUrl("/userpage/my-docs");
    this.where = "내 보관함";
  }

  /**
   * @description router to my-analysis in user page 
   */
  toMyAnalysis() {
    this.router.navigateByUrl("/userpage/my-analysis");
    this.where = "내 분석함";
  }

  /**
   * @description router to member-info in user page 
   */
  toMemberInfo() {
    this.router.navigateByUrl("/userpage/member-info");
    this.where = "회원정보관리";
  }

  /**
   * @description router to api register page in userpage 
   */
  toOpenAPI() {
    this.router.navigateByUrl("/api-register");
  }

  /**
   * @description router to secession page in userpage 
   */
  toSecession() {
    this.router.navigateByUrl("/userpage/secession");
    this.where = "회원탈퇴";
  }
}