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
  private _savedDocs: Array<{ title: string; hashKey: string; }>;
  private _paginationModel: PaginationModel;
  private _totalSavedDocsNum: number;
  private _form: FormGroup;
  private _isSavedDocsEmpty: boolean;

  //keywords
  private _isSavedKeywordsLoaded = false;
  private _isSavedKeywordsEmpty: boolean;
  private _savedKeywords: Array<{ keyword: string, savedDate: string; }>;
  private _keyword: string;
  private _savedDate: string;


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
    this.loadSavedKeywords();
  }

  /**
   * @description Load saved documents from userSavedDocumentService
   * @param pageNum
   */
  async loadSavedDocs(pageNum: number): Promise<void> {
    this.isSavedDocsLoaded = false;
    this.totalSavedDocsNum = await this.userSavedDocumentService.getTotalDocNum(this.keyword, this.savedDate);
    this.isSavedDocsEmpty = (this.totalSavedDocsNum === 0);
    if (this.isSavedDocsEmpty) return;
    pageNum = this.handlePageOverflow(pageNum);
    this.currentPage = pageNum;
    this.savedDocs = await this.userSavedDocumentService.getMyDocs( this.savedDate, pageNum);
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
   * @param docHashKey
   */
  openDocDetail(docHashKey: string): void {
    this.articleService.setSelectedHashKey(docHashKey);
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
        checkArray.push(new FormControl(this.savedDocs[i]["hashKey"]));
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
    this.userSavedDocumentService.eraseAllMyDocs(this.savedDate).then(
      () => this.loadSavedKeywords()
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
  public get savedDocs(): Array<{ title: string; hashKey: string; }> {
    return this._savedDocs;
  }
  public set savedDocs(value: Array<{ title: string; hashKey: string; }>) {
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

  //keyword
  public get isSavedKeywordsLoaded() {
    return this._isSavedKeywordsLoaded;
  }
  public set isSavedKeywordsLoaded(value) {
    this._isSavedKeywordsLoaded = value;
  }
  public get isSavedKeywordsEmpty(): boolean {
    return this._isSavedKeywordsEmpty;
  }
  public set isSavedKeywordsEmpty(value: boolean) {
    this._isSavedKeywordsEmpty = value;
  }
  public get savedKeywords(): Array<{ keyword: string, savedDate: string; }> {
    return this._savedKeywords;
  }
  public set savedKeywords(value: Array<{ keyword: string, savedDate: string; }>) {
    this._savedKeywords = value;
  }
  public get keyword(): string {
    return this._keyword;
  }
  public set keyword(value: string) {
    this._keyword = value;
  }
  public get savedDate(): string {
    return this._savedDate;
  }
  public set savedDate(value: string) {
    this._savedDate = value;
  }

  parsingSavedDate(savedDate: string){
    let date = new Date(savedDate);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();
    let hor = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    return year+"-"+month+"-"+dt+" "+hor+":"+min+":"+sec;
  }

  currentKeywordAndDate(keyword: string, savedDate: string){
    this.keyword = keyword;
    this.savedDate = savedDate;
    this.loadSavedDocs(1);
  }

  async loadSavedKeywords(): Promise<void> {
    this.isSavedKeywordsEmpty = false;
    this.isSavedKeywordsLoaded = false;
    this.savedKeywords = await this.userSavedDocumentService.getMyKeywords();
    this.isSavedKeywordsLoaded = true;
    if(this.savedKeywords.length === 0){
      this.isSavedKeywordsEmpty = true;
    }
    this.keyword = this.savedKeywords[0].keyword;
    this.savedDate = this.savedKeywords[0].savedDate;

    this.loadSavedDocs(1);
  }

  deleteSelectedDocs() {
    if (this.form.value["checkArray"].length == 0) {
      alert("삭제할 문서가 없습니다! 삭제할 문서를 선택해주세요.");
    } else {
      this.userSavedDocumentService.eraseSelectedMyDocs(this.form.value["checkArray"], this.savedDate).then(
        () => this.loadSavedKeywords(),
        this.form.value["checkArray"].clear()
      );
    }

  }
}
