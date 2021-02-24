import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { UserProfile } from "src/app/core/models/user.model";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { CommunityDocModel } from "../../models/community.doc.model";
import { CommunityBoardService } from "../../services/community-board-service/community.board.service";

@Component({
  selector: "app-announcement",
  templateUrl: "./board.annoucement.component.html",
  styleUrls: ["./board.annoucement.component.less"],
})
export class AnnouncementComponent implements OnInit {
  private docList: Array<CommunityDocModel>;
  private pageInfo: PaginationModel;
  private pageSize = 10;
  private totalDocs: number;
  private startIndex: number;
  private currentPage: number;
  private pages: number[];
  private totalPages: number;
  private mainAnnounceNum: number;
  private isSearchMode: boolean = false;
  private searchText: string;
  private isAdmin: boolean = false;
  private currentUser: UserProfile;

  constructor(
    private router: Router,
    private communityBoardService: CommunityBoardService,
    private paginationService: PaginationService,
    private authService: AuthenticationService
  ) {
    this.authService.getCurrentUserChange().subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (currentUser !== null && currentUser.isAdmin === true)
        this.isAdmin = true;
      else this.isAdmin = false;
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadPage(1);
  }

  async loadPage(currentPage: number): Promise<void> {
    this.docList = [];

    await this.loadAnnouncements();
    if (this.isSearchMode) {
      this.totalDocs = await this.communityBoardService.getSearchDocsNum(
        this.searchText
      );
      await this.loadSearchResults();
    } else {
      this.totalDocs = await this.communityBoardService.getDocsNum();
      await this.loadGenerals();
    }

    let pageInfo: PaginationModel = await this.paginationService.paginate(
      currentPage,
      this.totalDocs,
      this.pageSize
    );
    this.setPageInfo(pageInfo);
  }

  async loadAnnouncements() {
    this.mainAnnounceNum = 0;
    let announceDocs: Array<CommunityDocModel> = await this.communityBoardService.getMainAnnounceDocs();
    if (announceDocs.length === 0) {
      this.mainAnnounceNum = 0;
    } else {
      this.saveDocsInFormat(announceDocs);
      this.mainAnnounceNum = announceDocs.length;
    }
  }

  async loadGenerals() {
    let generalDocs: Array<CommunityDocModel> = await this.communityBoardService.getDocs(
      this.startIndex
    );
    if (generalDocs.length !== 0) this.saveDocsInFormat(generalDocs);
  }

  async loadSearchResults() {
    let resultDocs: Array<CommunityDocModel> = await this.communityBoardService.searchDocs(
      this.searchText
    );
    if (resultDocs.length !== 0) this.saveDocsInFormat(resultDocs);
  }

  async searchDocs($event): Promise<void> {
    if (this.isSearchMode) return;
    this.searchText = $event.target.value;
    this.isSearchMode = true;
    await this.loadPage(1);
    this.isSearchMode = false;
  }

  setPageInfo(pageInfo: PaginationModel) {
    this.pages = pageInfo.pages;
    this.currentPage = pageInfo.currentPage;
    this.startIndex = pageInfo.startIndex;
    this.totalPages = pageInfo.totalPages;
  }

  saveDocsInFormat(list: {}[]): void {
    if (list == null) return;
    list.forEach((doc: CommunityDocModel) => {
      doc["regDate"] = moment(doc["regDate"]).format("YY-MM-DD");
      this.docList.push(doc);
    });
  }

  navToReadThisDoc(i: number) {
    this.communityBoardService.setSelectedDoc(this.docList[i]);
    this.router.navigateByUrl("community/announcement/read");
  }

  navToWriteNewDoc() {
    this.router.navigateByUrl("community/announcement/new");
  }
}
