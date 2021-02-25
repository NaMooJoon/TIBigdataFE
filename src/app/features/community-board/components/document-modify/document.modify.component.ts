import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { CommunityBoardService } from "../../services/community-board-service/community.board.service";
import { CommunityDocModel } from "src/app/features/community-board/models/community.doc.model";

@Component({
  selector: "app-document-modify",
  templateUrl: "document.modify.component.html",
  styleUrls: ["document.modify.component.css"],
})
export class DocumentModifyComponent implements OnInit {
  constructor(
    private router: Router,
    private communityBoardService: CommunityBoardService,
    private auth: AuthenticationService
  ) {
    this.boardForm = new FormGroup({
      title: new FormControl("", Validators.required),
      content: new FormControl("", Validators.required),
      category: new FormControl(""),
      isMainAnnounce: new FormControl(""),
    });
  }

  private selectedBoard: string;
  private boardForm: FormGroup;
  private selectedDoc: CommunityDocModel;

  ngOnInit() {
    this.loadDoc();
  }

  async loadDoc() {
    this.selectedDoc = await this.communityBoardService.getSelectedDoc();
    this.selectedBoard = this.communityBoardService.getCurrentMenu();
    this.boardForm.controls["title"].setValue(this.selectedDoc.title);
    this.boardForm.controls["content"].setValue(this.selectedDoc.content);
    this.boardForm.controls["category"].setValue(this.selectedDoc.category);
    this.boardForm.controls["isMainAnnounce"].setValue(
      this.selectedDoc.isMainAnnounce
    );
  }

  async modifyDocument(): Promise<void> {
    let res: boolean = await this.communityBoardService.modifyDoc(
      this.generateQueryBody()
    );
    if (res) {
      window.alert("수정이 완료되었습니다.");
      this.toCommunity();
    } else {
      window.alert("오류가 발생했습니다. 다시 시도해주세요");
    }
  }

  toCommunity(): void {
    this.router.navigateByUrl(
      "/community/" + this.communityBoardService.getCurrentMenu()
    );
  }

  onCheckboxChange(): void {
    this.boardForm.controls["isMainAnnounce"].setValue(
      !this.boardForm.controls["isMainAnnounce"].value
    );
  }

  generateAnnounceQueryBody(): CommunityDocModel {
    return {
      docId: this.selectedDoc["docId"],
      title: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["title"].value
      ),
      content: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["content"].value
      ),
      isMainAnnounce: this.boardForm.controls["isMainAnnounce"].value,
    };
  }

  generateFaqQueryBody(): CommunityDocModel {
    return {
      docId: this.selectedDoc["docId"],
      title: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["title"].value
      ),
      content: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["content"].value
      ),
      category: this.boardForm.controls["category"].value,
    };
  }

  generateQnaQueryBody(): CommunityDocModel {
    return {
      docId: this.selectedDoc["docId"],
      title: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["title"].value
      ),
      content: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["content"].value
      ),
    };
  }

  generateQueryBody(): CommunityDocModel {
    if (this.communityBoardService.getCurrentMenu() == "announcement")
      return this.generateAnnounceQueryBody();
    if (this.communityBoardService.getCurrentMenu() == "faq")
      return this.generateFaqQueryBody();
    if (this.communityBoardService.getCurrentMenu() == "qna")
      return this.generateQnaQueryBody();
  }
}
