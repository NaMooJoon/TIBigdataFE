import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-userpage-root',
  templateUrl: './userpage-root.component.html',
  styleUrls: ['./userpage-root.component.less']
})
export class UserpageRootComponent implements OnInit {

  private where: String;

  constructor(
    public _router: Router,
    private navService: NavService,
  ) { }

  ngOnInit(): void {
    this.where = "내 보관함";
    this.navService.setNavMenu(navMenu.MYPAGE);
  }

  toMyDocs() {
    this._router.navigateByUrl("/userpage/my-docs");
    this.where = "내 보관함";

  }

  toMyAnalysis() {
    this._router.navigateByUrl("/userpage/my-analysis");
    this.where = "내 분석함";
  }

  toMemberInfo() {
    this._router.navigateByUrl("/userpage/member-info");
    this.where = "회원정보관리";
  }

  toOpenAPI() {
    this._router.navigateByUrl("/api-register");
  }

  toSecession() {
    this._router.navigateByUrl("/userpage/secession");
    this.where = "회원탈퇴";
  }

}
