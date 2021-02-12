import { Component, OnInit } from '@angular/core';
import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-library-root',
  templateUrl: './library-root.component.html',
  styleUrls: ['./library-root.component.less']
})
export class LibraryRootComponent implements OnInit {

  constructor(
    private navService: NavService,
  ) { }

  ngOnInit() {
    this.navService.setNavMenu(navMenu.LIBRARY);
  }

}
