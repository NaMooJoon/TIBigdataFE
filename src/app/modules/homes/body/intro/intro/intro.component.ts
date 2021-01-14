import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.less']
})
export class IntroComponent implements OnInit {

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
