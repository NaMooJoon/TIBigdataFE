import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { CommunityService } from 'src/app/modules/homes/body/community/community-services/community.service';
import { Location } from '@angular/common';
import { Res } from 'src/app/modules/communications/fe-backend-db/res.model';
import { EPAuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';
import { logStat } from 'src/app/modules/communications/fe-backend-db/membership/user.model';

@Component({
  selector: 'app-write-new-community-doc',
  templateUrl: './write-new-community-doc.component.html',
  styleUrls: ['./write-new-community-doc.component.less'],
})
export class WriteNewCommunityDocComponent {

  constructor(
    private router: Router,
    private cmService: CommunityService,
    private auth: EPAuthService,
    private _location: Location) { }

  private title: string;
  private content: string;
  private isMain: boolean;


  ngOnInit() {
    if (this.auth.getLogInStat() == logStat.unsigned) {
      window.alert('비정상적인 접근입니다. 로그인이 되어있는지 확인해주세요.');
      this.router.navigateByUrl('/community/announcement');
    }

    console.log(this.cmService.getCurrentMenu());
  }

  updateContent($event) {
    this.content = $event.target.value;
  }
  updateTitle($event) {
    this.title = $event.target.value;
  }

  async saveNewDocument() {
    let filteredContent: { title: string, body: string } = this.cmService.verifyPrivacyLeak(this.title, this.content);

    this.title = filteredContent.title;
    this.content = filteredContent.body;

    let body = {
      title: this.title,
      content: this.content,
      isMain: false,
    };



    let res: Res = await this.cmService.registerDoc(body);

    if (res.succ) {
      window.alert('등록이 완료되었습니다.');
      this.toCommunity();
    }
    else {
      window.alert('오류가 발생했습니다. 이후에 다시 시도해주세요');
    }

  }


  toCommunity() {
    this.router.navigateByUrl("/community/" + this.cmService.getBoardMenu());
  }

  gotoList() {
    this._location.back();
  }

}
