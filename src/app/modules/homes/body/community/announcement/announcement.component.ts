import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { boardMenu, CommunityService } from 'src/app/modules/communications/fe-backend-db/community/community.service';
import { logStat } from 'src/app/modules/communications/fe-backend-db/membership/user.model';
import { Res } from 'src/app/modules/communications/fe-backend-db/res.model';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { PaginationModel } from '../../shared-services/pagination-service/pagination.model';
import { PaginationService } from '../../shared-services/pagination-service/pagination.service';
import * as moment from 'moment';


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.less']
})

export class AnnouncementComponent implements OnInit {

  private docList: {}[] = [];
  private pageInfo: PaginationModel;
  private logStat: logStat;
  private pageSize = 10;
  private totalDocs: number;
  private startIndex: number;
  private currentPage: number;
  private pages: number[];
  private totalPages: number;

  constructor(
    private router: Router,
    private cmService: CommunityService,
    private pgService: PaginationService,
    private authService: EPAuthService,
  ) { }

  ngOnInit() {
    this.authService.getLoginStatChange().subscribe(stat => {
      this.logStat = stat;
      console.log("comm compo stat : ", stat)
    });
    this.cmService.setBoardMenu(boardMenu.ANNOUNCE);
    this.loadPage(1);
  }
  2
  async loadPage(currentPage: number) {
    this.docList = [];
    let resNum: Res = await this.cmService.getDocsNum();
    this.totalDocs = resNum.payload['data'];
    let pageInfo: PaginationModel = await this.pgService.paginate(currentPage, this.totalDocs, this.pageSize);
    this.setPageInfo(pageInfo);
    let res: Object = await this.cmService.getDocs(this.startIndex);
    this.saveDocsInFormat(res['data']);

    console.log(this.docList);
  }

  setPageInfo(pageInfo: PaginationModel) {
    this.pages = pageInfo.pages;
    this.currentPage = pageInfo.currentPage;
    this.startIndex = pageInfo.startIndex;
    this.totalPages = pageInfo.totalPages;
    console.log(this.totalPages);
    console.log(this.pages);
  }

  saveDocsInFormat(list: {}[]): void {
    list.forEach((doc) => {
      doc['regDate'] = moment(doc['regDate']).format('YYYY-MM-DD');
      this.docList.push(doc);
    });
  }

  navToReadThisDoc(i: number) {
    this.router.navigateByUrl("community/readDoc");
  }

  updateSearchKey($event: { target: { value: any; }; }) {
    let keyword = $event.target.value;
  }

  navToWriteNewDoc() {
    this.router.navigateByUrl("community/newDoc");

  }
}
