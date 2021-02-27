import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import { ArticleSource } from "src/app/core/models/article.model";
import { Subscription, Observable } from "rxjs";
import { AnalysisDatabaseService } from "src/app/core/services/analysis-database-service/analysis.database.service";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { UserSavedDocumentService } from "src/app/core/services/user-saved-document-service/user-saved-document.service";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { ArticleService } from "src/app/core/services/article-service/article.service";

@Component({
  selector: "app-article-list",
  templateUrl: "./article-list.component.html",
  styleUrls: ["./article-list.component.less"],
})
export class ArticleListComponent implements OnInit, OnDestroy {
  public orders = ["최신순", "과거순"];
  public amounts = [10, 30, 50];
  private _form: FormGroup;

  private _relatedDocs: ArticleSource[][] = [];
  private _articleNumChange$: Observable<any> = this.elasticSearchService.getArticleNumChange();
  private _articleChange$: Observable<ArticleSource[]> = this.elasticSearchService.getArticleChange();
  private _searchStatusChange$: Observable<boolean> = this.elasticSearchService.getSearchStatus();

  private _articleNumSubscriber: Subscription;
  private _articleSubscriber: Subscription;
  private _articleSources: ArticleSource[];
  private _relatedDocBtnToggle: Array<boolean>;
  private _isResultFound: boolean;
  private _isSearchDone: boolean;
  private _isLoggedIn: boolean;
  private _isMainSearch: boolean;

  private _searchResultNum: string = "0";
  private _searchKeyword: string;
  private _currentPage: number = 1;
  private _pages: number[];
  private _startIndex: number;
  private _totalPages: number = 1;
  private _totalDocs: number;
  private _pageSize: number = 10;

  constructor(
    private userSavedDocumentService: UserSavedDocumentService,
    private articleService: ArticleService,
    private router: Router,
    private elasticSearchService: ElasticsearchService,
    private analysisDatabaseService: AnalysisDatabaseService,
    private formBuilder: FormBuilder,
    private paginationService: PaginationService,
    private authService: AuthenticationService
  ) {
    // Set articles when article has been changed
    this.articleSubscriber = this.articleChange$.subscribe((articles) => {
      this.articleSources = articles;
      this.resetSearchOptions();
      this.setArticleIdList();
      this.setCheckbox();
      this.setArticleForm();

      this.isResultFound = articles !== null;
      this.elasticSearchService.setSearchStatus(true);
    });

    // Check if it is still searching
    this.searchStatusChange$.subscribe((status) => {
      this.isSearchDone = status;
    });

    // Set pagination and search result number when the number of articles has been changed
    this.articleNumSubscriber = this.articleNumChange$.subscribe((num) => {
      this.totalDocs = num;
      this.searchResultNum = this.convertNumberFormat(num);
      this.loadPage(this.elasticSearchService.getCurrentSearchingPage());
    });

    // Observe to check if user is signed out
    this.authService.getCurrentUserChange().subscribe((user) => {
      this.isLoggedIn = user != null;
    });
  }

  ngOnDestroy() {
    this.articleSubscriber.unsubscribe();
    this.articleNumSubscriber.unsubscribe();
  }

  ngOnInit() {
    this.resetSearchOptions();
    this.beginSearch(this.currentPage);
  }

  beginSearch(pageNum: number) {
    this.currentPage = pageNum;
    if (this.currentPage === null) this.currentPage = 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    if (this.currentPage < 1) this.currentPage = 1;
    this.elasticSearchService.triggerSearch(this.currentPage);
  }

  setArticleForm(): void {
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([]),
    });
  }

  setCheckbox(): void {
    for (let i in this.articleSources) {
      this.articleSources[i]["isSelected"] = false;
    }
  }

  setPageInfo(pageInfo: PaginationModel): void {
    this.pages = pageInfo.pages;
    this.currentPage = pageInfo.currentPage;
    this.startIndex = pageInfo.startIndex;
    this.totalPages = pageInfo.totalPages;
  }

  async loadPage(currentPage: number): Promise<void> {
    let pageInfo: PaginationModel = await this.paginationService.paginate(
      currentPage,
      this.totalDocs,
      this.pageSize
    );
    this.setPageInfo(pageInfo);
  }

  convertNumberFormat(num: number): string {
    let docCount: string = num.toString();
    if (num === 0) return docCount;
    return docCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  resetSearchOptions(): void {
    this.isMainSearch = this.router.url === "/search/result";
    this.articleService.clearList();
    this.searchKeyword = this.elasticSearchService.getKeyword();
    this.isResultFound = false;
    this.isSearchDone = false;
    this.currentPage = this.elasticSearchService.getCurrentSearchingPage();
  }

  setArticleIdList(): void {
    this.relatedDocBtnToggle = [];
    for (var i in this.articleSources) {
      this.articleService.addId(this.articleSources[i]["_id"]);
      this.relatedDocBtnToggle.push(false);
    }
  }

  openSelectedDoc(articleSourceIdx: number, RelatedDocIdx: number): void {
    this.articleService.setSelectedId(
      this.relatedDocs[articleSourceIdx][RelatedDocIdx]["id"]
    );
    this.navToDocDetail();
  }

  openRelatedDocList(i: number): void {
    this.loadRelatedDocs(i);
    this.relatedDocBtnToggle[i] = !this.relatedDocBtnToggle[i];
  }

  loadRelatedDocs(idx: number): void {
    this.analysisDatabaseService
      .loadRelatedDocs(this.articleService.getIdByIdx(idx))
      .then((res) => {
        this.relatedDocs[idx] = res as [];
      });
  }

  saveSelectedDocs(): void {
    if (this.form.value["checkArray"].length == 0) {
      alert("담을 문서가 없습니다! 담을 문서를 선택해주세요.");
    } else {
      this.userSavedDocumentService
        .saveNewMyDoc(this.form.value["checkArray"])
        .then(() => {
          alert("문서가 나의 문서함에 저장되었어요.");
        });
    }
  }

  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray): FormArray {
    if (isCheckAll) {
      for (let i = 0; i < this.articleSources.length; i++) {
        checkArray.push(new FormControl(this.articleSources[i]["_id"]));
      }
    } else {
      checkArray.clear();
    }

    for (let i = 0; i < this.articleSources.length; i++) {
      this.articleSources[i]["isSelected"] = isCheckAll;
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

  openDocDetail(docId: string): void {
    this.articleService.setSelectedId(docId);
    this.navToDocDetail();
  }

  docNumPerPageChange(num: number) {
    this.pageSize = num;
    this.elasticSearchService.setNumDocsPerPage(num);
    this.elasticSearchService.setCurrentSearchingPage(1);
    this.ngOnInit();
  }
  navToDocDetail(): void {
    this.router.navigateByUrl("search/DocDetail");
  }

  toggleArrowStyle(idx: number) {
    if (this.relatedDocBtnToggle[idx] !== true) {
      return {
        "background-image":
          "url(../../../../assets/icons/arrow-down_3d3d3d.png)",
      };
    }
  }

  getIsResultFound(): boolean {
    return this.isResultFound;
  }

  getIsMainSearch(): boolean {
    return this.isMainSearch;
  }

  getIsSearchDone(): boolean {
    return this.isSearchDone;
  }

  // getters and setters
  public get form(): FormGroup {
    return this._form;
  }
  public set form(value: FormGroup) {
    this._form = value;
  }

  public get relatedDocs(): ArticleSource[][] {
    return this._relatedDocs;
  }
  public set relatedDocs(value: ArticleSource[][]) {
    this._relatedDocs = value;
  }
  public get articleNumChange$(): Observable<any> {
    return this._articleNumChange$;
  }
  public set articleNumChange$(value: Observable<any>) {
    this._articleNumChange$ = value;
  }
  public get articleChange$(): Observable<ArticleSource[]> {
    return this._articleChange$;
  }
  public set articleChange$(value: Observable<ArticleSource[]>) {
    this._articleChange$ = value;
  }
  public get searchStatusChange$(): Observable<boolean> {
    return this._searchStatusChange$;
  }
  public set searchStatusChange$(value: Observable<boolean>) {
    this._searchStatusChange$ = value;
  }
  public get articleNumSubscriber(): Subscription {
    return this._articleNumSubscriber;
  }
  public set articleNumSubscriber(value: Subscription) {
    this._articleNumSubscriber = value;
  }
  public get articleSubscriber(): Subscription {
    return this._articleSubscriber;
  }
  public set articleSubscriber(value: Subscription) {
    this._articleSubscriber = value;
  }
  public get articleSources(): ArticleSource[] {
    return this._articleSources;
  }
  public set articleSources(value: ArticleSource[]) {
    this._articleSources = value;
  }
  public get relatedDocBtnToggle(): Array<boolean> {
    return this._relatedDocBtnToggle;
  }
  public set relatedDocBtnToggle(value: Array<boolean>) {
    this._relatedDocBtnToggle = value;
  }

  public get isResultFound(): boolean {
    return this._isResultFound;
  }
  public set isResultFound(value: boolean) {
    this._isResultFound = value;
  }
  public get isSearchDone(): boolean {
    return this._isSearchDone;
  }
  public set isSearchDone(value: boolean) {
    this._isSearchDone = value;
  }
  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  public set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }
  public get isMainSearch(): boolean {
    return this._isMainSearch;
  }
  public set isMainSearch(value: boolean) {
    this._isMainSearch = value;
  }
  public get searchResultNum(): string {
    return this._searchResultNum;
  }
  public set searchResultNum(value: string) {
    this._searchResultNum = value;
  }
  public get searchKeyword(): string {
    return this._searchKeyword;
  }
  public set searchKeyword(value: string) {
    this._searchKeyword = value;
  }
  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(value: number) {
    this._currentPage = value;
  }
  public get pages(): number[] {
    return this._pages;
  }
  public set pages(value: number[]) {
    this._pages = value;
  }
  public get startIndex(): number {
    return this._startIndex;
  }
  public set startIndex(value: number) {
    this._startIndex = value;
  }
  public get totalPages(): number {
    return this._totalPages;
  }
  public set totalPages(value: number) {
    this._totalPages = value;
  }
  public get totalDocs(): number {
    return this._totalDocs;
  }
  public set totalDocs(value: number) {
    this._totalDocs = value;
  }
  public get pageSize(): number {
    return this._pageSize;
  }
  public set pageSize(value: number) {
    this._pageSize = value;
  }
}
