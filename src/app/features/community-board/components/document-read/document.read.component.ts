import moment from "moment";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { CommunityBoardService } from "../../services/community-board-service/community.board.service";
import { CommunityDocModel } from "src/app/features/community-board/models/community.doc.model";
import { Location } from "@angular/common";
import { UserProfile } from "src/app/core/models/user.model";

@Component({
  selector: "app-document-read",
  templateUrl: "./document.read.component.html",
  styleUrls: ["./document.read.component.less"],
})
export class DocumentReadComponent implements OnInit {
  private _doc: CommunityDocModel;
  private _currentUser: UserProfile;
  private _currentMenu: string;
  private _isReplyMode: boolean;
  private _replyForm: FormGroup;
  private _isAnswered: boolean;
  private _isLoaded: boolean = false;
  private _currentUserEmail: string;
  private _isPostWriter: boolean;
  private _isReplyWriter: boolean;
  private _isAdmin: boolean;

  constructor(
    private communityBoardService: CommunityBoardService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _location: Location
  ) {
    this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (currentUser !== null) {
        this.currentUserEmail = currentUser.email;
        this.isAdmin = currentUser.isAdmin;
      } else this.isAdmin = false;
    });
  }

  async ngOnInit(): Promise<void> {
    this.currentMenu = this.router.url.split('/')[2];

    this.doc = await this.communityBoardService.getSelectedDoc();
    if (this.currentUserEmail === this.doc.userEmail) this.isPostWriter = true;
    else this.isPostWriter = false;
    if ("reply" in this.doc && this.currentUserEmail === this.doc.reply.userEmail)
      this.isReplyWriter = true;
    else this.isReplyWriter = false;

    this.isReplyMode = false;

    if (this.doc === undefined || this.doc === null) {
      window.alert("존재하지 않는 게시글입니다.");
      this.router.navigateByUrl("/community/announcement");
    }

    this.replyForm = new FormGroup({
      title: new FormControl("", Validators.required),
      content: new FormControl("", Validators.required),
    });

    if (this.doc != null && "reply" in this.doc) {
      this.isAnswered = true;
      this.doc.reply.regDate = moment(this.doc.reply.regDate).format("YY-MM-DD");
      this.doc.regDate = moment(this.doc.regDate).format("YY-MM-DD");
      this.replyForm.controls["title"].setValue(this.doc.reply.title);
      this.replyForm.controls["content"].setValue(this.doc.reply.content);
    } else if (this.doc != null) {
      this.doc.regDate = moment(this.doc.regDate).format("YY-MM-DD");
      this.isAnswered = false;
    } else {
      window.alert("존재하지 않는 게시글입니다.");
      this.router.navigateByUrl("/community/announcement");
    }
    this.isLoaded = true;
  }

  /**
   * @description Delete current document
   */
  async deleteDoc(): Promise<void> {
    let confirm = window.confirm("정말로 삭제하시겠습니까?");
    let res: boolean;
    if (confirm) {
      res = await this.communityBoardService.deleteDocs(this.doc["docId"]);
    }
    if (res) {
      window.alert("게시글이 삭제되었습니다.");
      this.router.navigateByUrl("/community/" + this.communityBoardService.getCurrentMenu()
      );
    } else {
      window.alert("게시글이 삭제에 실패했습니다. 새로고침 후 다시 시도해주세요."
      );
    }
  }

  /**
   * @description delete current reply
   */
  async deleteReply(): Promise<void> {
    let confirm = window.confirm("정말로 삭제하시겠습니까?");
    let res: boolean;
    if (confirm) {
      res = await this.communityBoardService.deleteReply(this.doc["docId"]);
    }
    if (res) {
      window.alert("게시글이 삭제되었습니다.");
      this.router.navigateByUrl("/community/" + this.communityBoardService.getCurrentMenu());
    } else {
      window.alert("게시글이 삭제에 실패했습니다. 새로고침 후 다시 시도해주세요.");
    }
  }

  /**
   * @description automatically grow height of input box when user writes.
   * @param e DOM event
   */
  autoGrowTextZone(e): void {
    e.target.style.height = "0px";
    e.target.style.height = e.target.scrollHeight + 25 + "px";
  }

  /**
   * @description Toggle reply mode into ture/false
   */
  changeReplyMode(): void {
    this.isReplyMode = !this.isReplyMode;
  }

  /**
   * @description Register new reply on the document.
   */
  async registerReply(): Promise<void> {
    let queryBody: CommunityDocModel = {
      docId: this.doc["docId"],
      reply: {
        title: this.replyForm.controls["title"].value,
        content: this.replyForm.controls["content"].value,
        userEmail: this.currentUser.email,
        userName: this.currentUser.name,
      },
    };
    if ("reply" in this.doc) {
      let res: boolean = await this.communityBoardService.modifyReply(queryBody);
      if (res) {
        window.alert("수정이 완료되었습니다.");
      }
      this.isAnswered = true;
      this.ngOnInit();
    } else {
      let res: boolean = await this.communityBoardService.registerReply(queryBody);
      if (res) {
        window.alert("수정이 완료되었습니다.");
      }
      this.isAnswered = true;
      this.ngOnInit();
    }
  }

  goToList() {
    this._location.back();
  }

  navigateToModDoc(): void {
    this.router.navigateByUrl("/community/" + this.currentMenu + "/modify");
  }

  //getters and setters
  public get doc(): CommunityDocModel {
    return this._doc;
  }
  public set doc(value: CommunityDocModel) {
    this._doc = value;
  }
  public get currentUser(): UserProfile {
    return this._currentUser;
  }
  public set currentUser(value: UserProfile) {
    this._currentUser = value;
  }
  public get currentMenu(): string {
    return this._currentMenu;
  }
  public set currentMenu(value: string) {
    this._currentMenu = value;
  }
  public get isReplyMode(): boolean {
    return this._isReplyMode;
  }
  public set isReplyMode(value: boolean) {
    this._isReplyMode = value;
  }
  public get replyForm(): FormGroup {
    return this._replyForm;
  }
  public set replyForm(value: FormGroup) {
    this._replyForm = value;
  }
  public get isAnswered(): boolean {
    return this._isAnswered;
  }
  public set isAnswered(value: boolean) {
    this._isAnswered = value;
  }
  public get isLoaded(): boolean {
    return this._isLoaded;
  }
  public set isLoaded(value: boolean) {
    this._isLoaded = value;
  }
  public get currentUserEmail(): string {
    return this._currentUserEmail;
  }
  public set currentUserEmail(value: string) {
    this._currentUserEmail = value;
  }
  public get isPostWriter(): boolean {
    return this._isPostWriter;
  }
  public set isPostWriter(value: boolean) {
    this._isPostWriter = value;
  }
  public get isReplyWriter(): boolean {
    return this._isReplyWriter;
  }
  public set isReplyWriter(value: boolean) {
    this._isReplyWriter = value;
  }
  public get isAdmin(): boolean {
    return this._isAdmin;
  }
  public set isAdmin(value: boolean) {
    this._isAdmin = value;
  }
}
