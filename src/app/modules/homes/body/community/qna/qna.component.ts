import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommunityService } from 'src/app/modules/homes/body/community/community-services/community.service';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { PaginationService } from '../../shared-services/pagination-service/pagination.service';

@Component({
  selector: 'app-qna',
  templateUrl: './qna.component.html',
  styleUrls: ['./qna.component.less']
})
export class QnaComponent implements OnInit {
  constructor(
    private router: Router,
    private cmService: CommunityService,
    private auth: EPAuthService,
    private pgService: PaginationService,
  ) { }

  ngOnInit() {

  }

}
