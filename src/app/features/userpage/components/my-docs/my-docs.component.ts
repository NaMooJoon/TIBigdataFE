import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { ArticleSource } from "src/app/core/models/article.model";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service"
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';
import { PaginationModel } from "src/app/core/models/pagination.model";
import { Router } from "@angular/router";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-my-docs",
  templateUrl: "./my-docs.component.html",
  styleUrls: ["./my-docs.component.less"],
})

export class MyDocsComponent implements OnInit {
  currentPage: number;
  pageInfo: PaginationModel;
  pages: number[];

  constructor(
    private authenticationService: AuthenticationService,
    private paginationService: PaginationService,
    private userSavedDocumentService: UserSavedDocumentService,
    private articleService: ArticleService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.setArticleForm();
  }

  private isSavedDocsLoaded = false;
  private savedDocs: Array<{ title: string; id: string }>;
  private paginationModel: PaginationModel;
  private totalSavedDocsNum: number;
  private form: FormGroup;

  ngOnInit(): void {
    this.loadSavedDocs(1);
  }

  /**
   * @description Load saved documents from userSavedDocumentService
   * @param pageNum 
   */
  async loadSavedDocs(pageNum: number): Promise<void> {
    this.isSavedDocsLoaded = false;
    this.totalSavedDocsNum = await this.userSavedDocumentService.getTotalDocNum();
    pageNum = this.handlePageOverflow(pageNum);
    this.currentPage = pageNum;
    this.savedDocs = await this.userSavedDocumentService.getMyDocs(pageNum);
    this.setCheckbox();
    this.pageInfo = await this.paginationService.paginate(pageNum, this.totalSavedDocsNum, 10, 3);
    this.pages = this.pageInfo.pages;
    this.isSavedDocsLoaded = true;
  }

  /**
   * @description Helper function for page number to handle the page overflow 
   * @param pageNum 
   */
  handlePageOverflow(pageNum: number): number {
    if (pageNum < 0) pageNum = 1;
    else if (pageNum * 10 > this.totalSavedDocsNum) pageNum = this.totalSavedDocsNum / 10;
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

  openDocDetail(docId: string): void {
    console.log(docId);
    this.articleService.setSelectedId(docId);
    this.navToDocDetail();
  }

  navToDocDetail(): void {
    this.router.navigateByUrl("search/read");
  }


  setCheckbox(): void {
    for (let i in this.savedDocs) {
      this.savedDocs[i]["isSelected"] = false;
    }
  }

  setArticleForm(): void {
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([]),
    });
  }


  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray): FormArray {
    if (isCheckAll) {
      for (let i = 0; i < this.savedDocs.length; i++) {
        checkArray.push(new FormControl(this.savedDocs[i]["id"]));
      }
    } else {
      checkArray.clear();
    }

    for (let i = 0; i < this.savedDocs.length; i++) {
      this.savedDocs[i]["isSelected"] = isCheckAll;
    }

    return checkArray;
  }

  onCheckboxChange(e): void {
    let checkArray: FormArray = this.form.get("checkArray") as FormArray;
    if (e.target.value === "toggleAll") {
      checkArray = this.checkUncheckAll(e.target.checked, checkArray);
    } else {
      if (e.target.checked) {
        checkArray.push(new FormControl(e.target.value));
      } else {
        let i: number = 0;
        checkArray.controls.forEach((item: FormControl) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        });
      }
    }
  }

  /**
   * @description delete all my documents 
   */
  deleteAllMyDocs() {
    this.userSavedDocumentService.eraseAllMyDocs().then(
      () => this.loadSavedDocs(1)
    );
  }
}