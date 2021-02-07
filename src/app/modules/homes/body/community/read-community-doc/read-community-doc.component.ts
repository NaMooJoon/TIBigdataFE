import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EPAuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';
import { Auth } from 'src/app/modules/communications/fe-backend-db/membership/userAuth.model';
import { CommunityService } from "src/app/modules/homes/body/community/community-services/community.service";
import { CommunityDocModel } from '../community.doc.model';

@Component({
  selector: 'app-read-community-doc',
  templateUrl: './read-community-doc.component.html',
  styleUrls: ['./read-community-doc.component.less']
})
export class ReadCommunityDocComponent implements OnInit {
  private doc: CommunityDocModel;
  private currentUser: String;
  private currentMenu: string;
  private isReplyMode: boolean;
  private replyForm: FormGroup;
  private isAnswered: boolean;

  constructor(
    private cmService: CommunityService,
    private router: Router,
    private auth: EPAuthService) { }

  ngOnInit() {
    this.doc = this.cmService.getSelectedDoc();
    this.currentMenu = this.cmService.getCurrentMenu();
    this.isReplyMode = false;

    if (this.doc === undefined || this.doc === null) {
      window.alert('존재하지 않는 게시글입니다.');
      this.router.navigateByUrl("/community/announcement");
    }

    this.replyForm = new FormGroup({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required),
    });

    if ('reply' in this.doc) {
      this.isAnswered = true;
      console.log(this.isAnswered);
    }
    else {
      this.isAnswered = false;
      console.log(this.isAnswered);
    }
  }

  async deleteDoc() {
    let confirm = window.confirm("정말로 삭제하시겠습니까?");
    let res: boolean;
    if (confirm) {
      res = await this.cmService.deleteDocs(this.doc['docId']);
    }
    if (res) {
      window.alert("게시글이 삭제되었습니다.");
      this.router.navigateByUrl("/community/" + this.cmService.getCurrentMenu());
    }
    else {
      window.alert("게시글이 삭제에 실패했습니다. 새로고침 후 다시 시도해주세요.");
    }
  }

  navigateToModDoc() {
    this.router.navigateByUrl('/community/modDoc');
  }
  autoGrowTextZone(e) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 25) + "px";
  }
  changeReplyMode() {
    this.isReplyMode = !this.isReplyMode;
  }

  registerReply() {
    let queryBody: CommunityDocModel = {
      "docId": this.doc["docId"],
      "reply": {
        "title": this.replyForm.controls['title'].value,
        "content": this.replyForm.controls['content'].value,
        "userEmail": this.auth.getUserEmail(),
        "userName": this.auth.getUserName(),
      }
    }
    if (this.doc.reply === null) {
      this.cmService.registerReply(queryBody);
      this.doc.reply.regDate = moment(this.doc.reply.regDate).format('YY-MM-DD');
      console.log(this.doc.reply.regDate);
      this.ngOnInit();
    }
    else {
      this.cmService.modifyReply(queryBody);
      this.doc.reply.regDate = moment(this.doc.reply.regDate).format('YY-MM-DD')
      this.ngOnInit();

    }
  }
}
