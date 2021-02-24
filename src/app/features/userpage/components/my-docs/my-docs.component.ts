import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { ArticleSource } from "src/app/core/models/article.model";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service"
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';
import { PaginationModel } from "src/app/core/models/pagination.model";

@Component({
  selector: "app-my-docs",
  templateUrl: "./my-docs.component.html",
  styleUrls: ["./my-docs.component.less"],
})

export class MyDocsComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private paginationService: PaginationService,
    private userSavedDocumentService: UserSavedDocumentService,
    private articleService: ArticleService,
  ) { 
  }

  private isSavedDocsLoaded = false;
  private savedDocs: Array<{ title: string; id: string }>;
  private paginationModel: PaginationModel;
  private totalSavedDocsNum: number;

  ngOnInit(): void {

    this.loadSavedDocs(1);

  }

  /**
   * @description load saved documents from userSavedDocumentService
   * @param pageNum input is current page number
   */
  async loadSavedDocs(pageNum: number): Promise<void> {
    this.isSavedDocsLoaded = false;
    this.totalSavedDocsNum = await this.userSavedDocumentService.getTotalDocNum();
    pageNum = this.handlePageOverflow(pageNum);
    this.savedDocs = await this.userSavedDocumentService.getMyDocs(pageNum);
    this.paginationModel = await this.paginationService.paginate(
      pageNum,
      this.totalSavedDocsNum,
      10,
      3
    );

    console.log(this.paginationModel);
    this.isSavedDocsLoaded = true;
  }

  /**
   * @description helper function for page number to handle the page overflow 
   * @param pageNum 
   */
  handlePageOverflow(pageNum: number): number {
    if (pageNum < 0) pageNum = 1;
    else if (pageNum > this.totalSavedDocsNum) pageNum = this.totalSavedDocsNum;

    return pageNum;
  }

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        color: "white",
        "background-color": "#0FBAFF",
        border: "none",
        "font-weight": "700",
      };
    } else {
      return {
        color: "black",
        "background-color": "white",
      };
    }
  }

  /**
   * @description delete all my documents 
   */
  deleteAllMyDocs() {
    console.log("문서 지우기")
    this.userSavedDocumentService.eraseAllMyDocs().then(
      () => this.loadSavedDocs(1)
    );

  }

}