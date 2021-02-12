import { Component, OnInit } from '@angular/core';
import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-search-root',
  templateUrl: './search-root.component.html',
  styleUrls: ['./search-root.component.less']
})
export class SearchRootComponent implements OnInit {

  constructor(
    private navService: NavService,
  ) { }

  ngOnInit() {
    this.navService.setNavMenu(navMenu.NONE);
  }

}
