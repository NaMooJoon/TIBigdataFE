import { Component } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { CommunityBoardService } from "../../services/community-board-service/community.board.service";
import { CommunityDocModel } from "src/app/features/community-board/models/community.doc.model";
import { Location } from "@angular/common";
import { QueryResponse } from "src/app/core/models/query.response.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserProfile } from "src/app/core/models/user.model";

@Component({
  selector: "app-documnet-write",
  templateUrl: "./document.write.component.html",
  styleUrls: ["./document.write.component.less"],
})
export class DocumentWriteComponent {

  private _boardForm: FormGroup;
  private _isMainAnnounce = false;
  private _currentUser: UserProfile;
  private _selectedBoard: string;

  constructor(
    private router: Router,
    private communityBoardService: CommunityBoardService,
    private authenticationService: AuthenticationService,
    private _location: Location
  ) {
    this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectedBoard = this.communityBoardService.getCurrentMenu();
      }
    })
  }

  ngOnInit() {
    if (this.communityBoardService.getCurrentMenu() === null) {
      window.alert("비정상적인 접근입니다. 공지사항 페이지로 이동합니다.");
      this.router.navigateByUrl("/community/announcement");
    }
    this.boardForm = new FormGroup({
      title: new FormControl("", Validators.required),
      content: new FormControl("", Validators.required),
      category: new FormControl(""),
      isMainAnnounce: new FormControl(false),
    });
  }

  /**
   * @description Register new document
   */
  async saveNewDocument(): Promise<void> {
    let res: QueryResponse = await this.communityBoardService.registerDoc(
      this.generateQueryBody()
    );
    if (res.isSuccess) {
      window.alert("등록이 완료되었습니다.");
      this.toCommunity();
    } else {
      window.alert("오류가 발생했습니다. 다시 시도해주세요");
    }
  }

  /**
   * @description Create query body by adding user information and filter content
   * @returns query model for community document
   */
  generateAnnounceQueryBody(): CommunityDocModel {
    return {
      userEmail: this.currentUser.email,
      userName: this.currentUser.name,
      title: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["title"].value
      ),
      content: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["content"].value
      ),
      isMainAnnounce: this.boardForm.controls["isMainAnnounce"].value,
    };
  }

  /**
   * @description Create query body by adding user information and filter content
   * @returns query model for community document
   */
  generateFaqQueryBody(): CommunityDocModel {
    return {
      userEmail: this.currentUser.email,
      userName: this.currentUser.name,
      title: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["title"].value
      ),
      content: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["content"].value
      ),
      category: this.boardForm.controls["category"].value,
    };
  }

  /**
   * @description Create query body by adding user information and filter content
   * @returns query model for community document
   */
  generateQnaQueryBody(): CommunityDocModel {
    return {
      userEmail: this.currentUser.email,
      userName: this.currentUser.name,
      title: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["title"].value
      ),
      content: this.communityBoardService.verifyPrivacyLeak(
        this.boardForm.controls["content"].value
      ),
    };
  }

  /**
   * @description Call query body genreation according to current menu.
   * @returns generated query body
   */
  generateQueryBody(): CommunityDocModel {
    if (this.communityBoardService.getCurrentMenu() == "announcement")
      return this.generateAnnounceQueryBody();
    if (this.communityBoardService.getCurrentMenu() == "faq")
      return this.generateFaqQueryBody();
    if (this.communityBoardService.getCurrentMenu() == "qna")
      return this.generateQnaQueryBody();
  }

  toCommunity(): void {
    this.router.navigateByUrl(
      "/community/" + this.communityBoardService.getCurrentMenu()
    );
  }

  gotoList(): void {
    this._location.back();
  }

  onCheckboxChange(): void {
    this.boardForm.controls["isMainAnnounce"].setValue(
      !this.boardForm.controls["isMainAnnounce"].value
    );
  }

  // getters and setters
  public get boardForm(): FormGroup {
    return this._boardForm;
  }
  public set boardForm(value: FormGroup) {
    this._boardForm = value;
  }
  public get isMainAnnounce() {
    return this._isMainAnnounce;
  }
  public set isMainAnnounce(value) {
    this._isMainAnnounce = value;
  }
  public get currentUser(): UserProfile {
    return this._currentUser;
  }
  public set currentUser(value: UserProfile) {
    this._currentUser = value;
  }
  public get selectedBoard(): string {
    return this._selectedBoard;
  }
  public set selectedBoard(value: string) {
    this._selectedBoard = value;
  }
}
