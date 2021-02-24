import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-policy',
  templateUrl: './member-policy.component.html',
  styleUrls: ['./member-policy.component.less']
})
export class MemberPolicyComponent implements OnInit {

  constructor(
    public _router: Router,
  ) { }

  ngOnInit(): void {
  }

  toSiteIntro() {
    this._router.navigateByUrl("/introduce/intro");
  }

  toServiceGuide() {
    this._router.navigateByUrl("/introduce/service-guide");
  }

  toCollectedInfo() {
    this._router.navigateByUrl("/introduce/collected-info");
  }

  toMemberPolicy() {
    this._router.navigateByUrl("/introduce/member-policy");
  }

}
