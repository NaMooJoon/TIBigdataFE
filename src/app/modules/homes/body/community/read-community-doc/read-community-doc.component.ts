import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private cmService: CommunityService,
    private router: Router,
    private auth: EPAuthService) { }
  ngOnInit() {
    this.doc = this.cmService.getSelectedDoc();
    // this.currentUser = this.auth.getUserEmail();
    // console.log(this.auth.getUserEmail());

    console.log(this.doc);
    if (this.doc === undefined || this.doc === null) {
      window.alert('존재하지 않는 게시글입니다.');
      this.router.navigateByUrl("/community/announcement");
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

}
