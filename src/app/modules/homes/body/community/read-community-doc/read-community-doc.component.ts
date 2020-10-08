import { Component, OnInit } from '@angular/core';
import { CommunityServiceService } from "src/app/modules/communications/fe-backend-db/community/community-service.service";

@Component({
  selector: 'app-read-community-doc',
  templateUrl: './read-community-doc.component.html',
  styleUrls: ['./read-community-doc.component.less']
})
export class ReadCommunityDocComponent implements OnInit {

  private doc = {};
  constructor(private cm_svc : CommunityServiceService) { }
  ngOnInit() {
    this.doc = this.cm_svc.getChosenDoc();
    // console.log(this.doc);
  }

}
