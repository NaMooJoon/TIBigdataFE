import { Component, OnInit } from '@angular/core';
import { CommunityService } from "src/app/modules/homes/body/community/community-services/community.service";

@Component({
  selector: 'app-read-community-doc',
  templateUrl: './read-community-doc.component.html',
  styleUrls: ['./read-community-doc.component.less']
})
export class ReadCommunityDocComponent implements OnInit {

  private doc = {};
  constructor(private cmService: CommunityService) { }
  ngOnInit() {
    this.doc = this.cmService.getChosenDoc();
  }

}
