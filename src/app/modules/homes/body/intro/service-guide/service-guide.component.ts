import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-guide',
  templateUrl: './service-guide.component.html',
  styleUrls: ['./service-guide.component.less']
})
export class ServiceGuideComponent implements OnInit {

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
