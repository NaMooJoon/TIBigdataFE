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


}