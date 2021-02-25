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
  selector: "app-faq",
  templateUrl: "./board.faq.component.html",
  styleUrls: ["./board.faq.component.less"],
})
export class FaqComponent implements OnInit {
  private docList: Array<CommunityDocModel>;
  private pageInfo: PaginationModel;

  private pageSize = 10;
  private totalDocs: number;
  private startIndex: number = 0;
  private currentPage: number;
  private pages: number[];
  private totalPages: number;
  private isSearchMode: boolean = false;
  private searchText: string;
  private isAdmin: boolean = false;
  private currentUser: UserProfile;

  constructor(
    private router: Router,
    private cmService: CommunityBoardService,
    private pgService: PaginationService,
    private authService: AuthenticationService
  ) {
    this.authService.getCurrentUserChange().subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (currentUser !== null && currentUser.isAdmin === true)
        this.isAdmin = true;
      else this.isAdmin = false;
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  async loadPage(currentPage: number) {
    this.docList = [];

    if (this.isSearchMode) {
      this.totalDocs = await this.cmService.getSearchDocsNum(this.searchText);
      await this.loadSearchResults();
    } else {
      this.totalDocs = await this.cmService.getDocsNum();
      await this.loadDocs();
    }

    let pageInfo: PaginationModel = await this.pgService.paginate(
      currentPage,
      this.totalDocs,
      this.pageSize
    );
    this.setPageInfo(pageInfo);
  }

  async loadDocs() {
    let generalDocs: Array<CommunityDocModel> = await this.cmService.getDocs(
      this.startIndex
    );
    if (generalDocs.length !== 0) this.saveDocsInFormat(generalDocs);
  }

  setPageInfo(pageInfo: PaginationModel) {
    this.pages = pageInfo.pages;
    this.currentPage = pageInfo.currentPage;
    this.startIndex = pageInfo.startIndex;
    this.totalPages = pageInfo.totalPages;
  }

  saveDocsInFormat(list: {}[]): void {
    if (list === null) return;
    list.forEach((doc: CommunityDocModel) => {
      doc["regDate"] = moment(doc["regDate"]).format("YY-MM-DD");
      this.docList.push(doc);
    });
  }

  navToReadThisDoc(i: number) {
    this.cmService.setSelectedDoc(this.docList[i]);
    this.router.navigateByUrl("community/faq/read");
  }

  updateSearchKey($event: { target: { value: any } }) {
    let keyword = $event.target.value;
  }

  navToWriteNewDoc() {
    this.router.navigateByUrl("community/faq/new");
  }

  async loadSearchResults() {
    let resultDocs: Array<CommunityDocModel> = await this.cmService.searchDocs(
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
}
