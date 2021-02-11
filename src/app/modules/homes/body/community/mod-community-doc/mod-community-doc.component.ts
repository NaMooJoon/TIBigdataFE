import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EPAuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';
import { logStat } from 'src/app/modules/communications/fe-backend-db/membership/user.model';
import { Res } from 'src/app/modules/communications/fe-backend-db/res.model';
import { CommunityService, boardMenu } from '../community-services/community.service';
import { CommunityDocModel } from '../community.doc.model';

@Component({
  selector: 'app-mod-community-doc',
  templateUrl: './mod-community-doc.component.html',
  styleUrls: ['./mod-community-doc.component.css']
})
export class ModCommunityDocComponent implements OnInit {
  constructor(
    private router: Router,
    private cmService: CommunityService,
    private auth: EPAuthService,
  ) {
    this.boardForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
      category: new FormControl(''),
      isMainAnnounce: new FormControl(''),
    });
  }

  private selectedBoard: string;
  private boardForm: FormGroup;
  private selectedDoc: CommunityDocModel;

  ngOnInit() {
    if (this.auth.getLogInStat() == logStat.unsigned || this.cmService.getCurrentMenu() === null || this.selectedDoc === null) {
      window.alert('비정상적인 접근입니다. 로그인이 되어있는지 확인해주세요.');
      this.router.navigateByUrl('/community/announcement');
      this.router.dispose();
    }
    else this.loadDoc();
  }

  async loadDoc() {
    this.selectedDoc = await this.cmService.getSelectedDoc();
    this.selectedBoard = this.cmService.getCurrentMenu();
    this.boardForm.controls['title'].setValue(this.selectedDoc.title);
    this.boardForm.controls['content'].setValue(this.selectedDoc.content);
    this.boardForm.controls['category'].setValue(this.selectedDoc.category);
    this.boardForm.controls['isMainAnnounce'].setValue(this.selectedDoc.isMainAnnounce);
  }

  async modifyDocument(): Promise<void> {
    let res: boolean = await this.cmService.modifyDoc(this.generateQueryBody());
    if (res) {
      window.alert('수정이 완료되었습니다.');
      this.toCommunity();
    }
    else {
      window.alert('오류가 발생했습니다. 다시 시도해주세요');
    }
  }

  toCommunity(): void {
    this.router.navigateByUrl("/community/" + this.cmService.getCurrentMenu());
  }

  onCheckboxChange(): void {
    this.boardForm.controls['isMainAnnounce'].setValue(!this.boardForm.controls['isMainAnnounce'].value);
  }

  generateAnnounceQueryBody(): CommunityDocModel {
    return {
      docId: this.selectedDoc['docId'],
      title: this.cmService.verifyPrivacyLeak(this.boardForm.controls['title'].value),
      content: this.cmService.verifyPrivacyLeak(this.boardForm.controls['content'].value),
      isMainAnnounce: this.boardForm.controls['isMainAnnounce'].value,
    };
  }

  generateFaqQueryBody(): CommunityDocModel {
    return {
      docId: this.selectedDoc['docId'],
      title: this.cmService.verifyPrivacyLeak(this.boardForm.controls['title'].value),
      content: this.cmService.verifyPrivacyLeak(this.boardForm.controls['content'].value),
      category: this.boardForm.controls['category'].value,
    };
  }

  generateQnaQueryBody(): CommunityDocModel {
    return {
      docId: this.selectedDoc['docId'],
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
