import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-intro-root',
  templateUrl: './intro-root.component.html',
  styleUrls: ['./intro-root.component.less']
})
export class IntroRootComponent implements OnInit {

  constructor(
    private router: Router,
    private navService: NavService,
  ) { }

  ngOnInit() {
    this.navService.setNavMenu(navMenu.ABOUT);
  }

  toSiteIntro() {
    this.router.navigateByUrl("/introduce/intro");
  }

  toServiceGuide() {
    this.router.navigateByUrl("/introduce/service-guide");
  }

  toCollectedInfo() {
    this.router.navigateByUrl("/introduce/collected-info");
  }

  toMemberPolicy() {
    this.router.navigateByUrl("/introduce/member-policy");
  }


}
