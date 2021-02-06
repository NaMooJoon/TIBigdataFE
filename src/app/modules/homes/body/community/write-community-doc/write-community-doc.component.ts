import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { boardMenu, CommunityService } from 'src/app/modules/homes/body/community/community-services/community.service';
import { Location } from '@angular/common';
import { Res } from 'src/app/modules/communications/fe-backend-db/res.model';
import { EPAuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';
import { logStat } from 'src/app/modules/communications/fe-backend-db/membership/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommunityDocModel } from '../community.doc.model';

@Component({
  selector: 'app-write-community-doc',
  templateUrl: './write-community-doc.component.html',
  styleUrls: ['./write-community-doc.component.less'],
})
export class WriteCommunityDocComponent {

  constructor(
    private router: Router,
    private cmService: CommunityService,
    private auth: EPAuthService,
    private _location: Location) { }

  private selectedBoard: boardMenu = 0;
  private boardForm: FormGroup;
  private isMainAnnounce = false;

  ngOnInit() {
    if (this.auth.getLogInStat() == logStat.unsigned) {
      window.alert('비정상적인 접근입니다. 로그인이 되어있는지 확인해주세요.');
      this.router.navigateByUrl('/community/announcement');
    }

    if (this.cmService.getCurrentMenu() === null) {
      window.alert('비정상적인 접근입니다. 공지사항 페이지로 이동합니다.');
      this.router.navigateByUrl('/community/announcement');
    }

    this.boardForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      category: new FormControl('')
    });

    this.cmService.getBoardMenuChange().subscribe((menu) => {
      this.selectedBoard = menu;
    });
  }

  async saveNewDocument(): Promise<void> {
    let res: Res = await this.cmService.registerDoc(this.generateQueryBody());
    if (res.succ) {
      window.alert('등록이 완료되었습니다.');
      this.toCommunity();
    }
    else {
      window.alert('오류가 발생했습니다. 다시 시도해주세요');
    }
  }

  toCommunity(): void {
    this.router.navigateByUrl("/community/" + this.cmService.getCurrentMenu());
  }

  gotoList(): void {
    this._location.back();
  }

  onCheckboxChange($event): void {
    this.isMainAnnounce = $event.target.checked;
  }

  generateAnnounceQueryBody(): CommunityDocModel {
    console.log(this.isMainAnnounce)
    return {
      userEmail: this.auth.getUserEmail(),
      userName: this.auth.getUserName(),
      title: this.cmService.verifyPrivacyLeak(this.boardForm.controls['title'].value),
      content: this.cmService.verifyPrivacyLeak(this.boardForm.controls['content'].value),
      isMainAnnounce: this.isMainAnnounce,
    };
  }

  generateFaqQueryBody(): CommunityDocModel {
    return {
      userEmail: this.auth.getUserEmail(),
      userName: this.auth.getUserName(),
      title: this.cmService.verifyPrivacyLeak(this.boardForm.controls['title'].value),
      content: this.cmService.verifyPrivacyLeak(this.boardForm.controls['content'].value),
      category: this.boardForm.controls['category'].value,
    };
  }

  generateQnaQueryBody(): CommunityDocModel {
    return {
      userEmail: this.auth.getUserEmail(),
      userName: this.auth.getUserName(),
      title: this.cmService.verifyPrivacyLeak(this.boardForm.controls['title'].value),
      content: this.cmService.verifyPrivacyLeak(this.boardForm.controls['content'].value),
    };
  }

  generateQueryBody(): CommunityDocModel {
    if (this.cmService.getCurrentMenu() == 'announcement') return this.generateAnnounceQueryBody();
    if (this.cmService.getCurrentMenu() == 'faq') return this.generateFaqQueryBody();
    if (this.cmService.getCurrentMenu() == 'qna') return this.generateQnaQueryBody();
  }
}



