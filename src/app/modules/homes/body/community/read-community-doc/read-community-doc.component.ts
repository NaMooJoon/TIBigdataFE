import { Component, OnInit } from '@angular/core';
import { CommunityService } from "src/app/modules/homes/body/community/community-services/community.service";

@Component({
  selector: 'app-read-community-doc',
  templateUrl: './read-community-doc.component.html',
  styleUrls: ['./read-community-doc.component.less']
})
export class ReadCommunityDocComponent implements OnInit {

  private doc = {};
  constructor(private cm_svc: CommunityService) { }
  ngOnInit() {
    this.doc = this.cm_svc.getChosenDoc();
    // console.log(this.doc);
  }

}
