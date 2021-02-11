import { Component, OnInit } from '@angular/core';
import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-specials-root',
  templateUrl: './specials-root.component.html',
  styleUrls: ['./specials-root.component.less']
})
export class SpecialsRootComponent implements OnInit {

  constructor(
    private navService: NavService,
  ) { }

  ngOnInit() {
    this.navService.setNavMenu(navMenu.ANALYSIS);
  }

}
