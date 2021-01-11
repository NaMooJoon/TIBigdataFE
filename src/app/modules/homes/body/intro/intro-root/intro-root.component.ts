import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro-root',
  templateUrl: './intro-root.component.html',
  styleUrls: ['./intro-root.component.less']
})
export class IntroRootComponent implements OnInit {

  constructor(
    public _router: Router,
  ) { }

  ngOnInit() {
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
