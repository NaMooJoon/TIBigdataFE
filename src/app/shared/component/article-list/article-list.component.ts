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
  orders = ["최신순", "과거순"];
  amounts = [10, 30, 50];
  form: FormGroup;

  private relatedDocs: ArticleSource[][] = [];
  private articleNumChange$: Observable<any> = this.elasticSearchService.getArticleNumChange();
  private articleChange$: Observable<
    ArticleSource[]
  > = this.elasticSearchService.getArticleChange();
  private searchStatusChange$: Observable<boolean> = this.elasticSearchService.getSearchStatus();

  private articleNumSubscriber: Subscription;
  private articleSubscriber: Subscription;
  private articleSources: ArticleSource[];
  private RelatedDocBtnToggle: Array<boolean>;

  private isResultFound: boolean;
  private isSearchDone: boolean;
  private isLoggedIn: boolean;
  private isMainSearch: boolean;

  private searchResultNum: string = "0";
  private searchKeyword: string;

  private currentPage: number = 1;
  private pages: number[];
  private startIndex: number;
  private totalPages: number = 1;
  private totalDocs: number;
  private pageSize: number = 10;

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
    this.RelatedDocBtnToggle = [];
    for (var i in this.articleSources) {
      this.articleService.addId(this.articleSources[i]["_id"]);
      this.RelatedDocBtnToggle.push(false);
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
    this.RelatedDocBtnToggle[i] = !this.RelatedDocBtnToggle[i];
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
    if (this.RelatedDocBtnToggle[idx] !== true) {
      return {
        "background-image":
          "url(../../../../assets/icons/arrow-down_3d3d3d.png)",
      };
    }
  }
}
