import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';

@Component({
  selector: "app-my-docs",
  templateUrl: "./my-docs.component.html",
  styleUrls: ["./my-docs.component.less"],
})

export class MyDocsComponent implements OnInit {
  private _currentPage: number;
  private _pageInfo: PaginationModel;
  private _pages: number[];
  private _isSavedDocsLoaded = false;
  private _savedDocs: Array<{ title: string; id: string; }>;
  private _paginationModel: PaginationModel;
  private _totalSavedDocsNum: number;
  private _form: FormGroup;
  private _isSavedDocsEmpty: boolean;


  constructor(
    private paginationService: PaginationService,
    private userSavedDocumentService: UserSavedDocumentService,
    private articleService: ArticleService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.setArticleForm();
  }

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
    this.isSavedDocsEmpty = (this.totalSavedDocsNum === 0);
    if (this.isSavedDocsEmpty) return;
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

  /**
   * @description 
   * @param docId 
   */
  openDocDetail(docId: string): void {
    console.log(docId);
    this.articleService.setSelectedId(docId);
    this.navToDocDetail();
  }

  /**
   * @description Navigate to doc detail 
   */
  navToDocDetail(): void {
    this.router.navigateByUrl("search/read");
  }

  /**
   * @description Set the checkbox of saved docs 
   */
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

  /**
   * @description Check or uncheck all documents 
   * @param isCheckAll 
   * @param checkArray 
   */
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

  /**
   * @description Change check box 
   * @param e 
   */
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

  // getters and setters
  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(value: number) {
    this._currentPage = value;
  }
  public get pageInfo(): PaginationModel {
    return this._pageInfo;
  }
  public set pageInfo(value: PaginationModel) {
    this._pageInfo = value;
  }
  public get pages(): number[] {
    return this._pages;
  }
  public set pages(value: number[]) {
    this._pages = value;
  }
  public get isSavedDocsLoaded() {
    return this._isSavedDocsLoaded;
  }
  public set isSavedDocsLoaded(value) {
    this._isSavedDocsLoaded = value;
  }
  public get savedDocs(): Array<{ title: string; id: string; }> {
    return this._savedDocs;
  }
  public set savedDocs(value: Array<{ title: string; id: string; }>) {
    this._savedDocs = value;
  }
  public get paginationModel(): PaginationModel {
    return this._paginationModel;
  }
  public set paginationModel(value: PaginationModel) {
    this._paginationModel = value;
  }
  public get totalSavedDocsNum(): number {
    return this._totalSavedDocsNum;
  }
  public set totalSavedDocsNum(value: number) {
    this._totalSavedDocsNum = value;
  }
  public get form(): FormGroup {
    return this._form;
  }
  public set form(value: FormGroup) {
    this._form = value;
  }
  public get isSavedDocsEmpty(): boolean {
    return this._isSavedDocsEmpty;
  }
  public set isSavedDocsEmpty(value: boolean) {
    this._isSavedDocsEmpty = value;
  }
}