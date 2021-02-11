import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription, Observable } from "rxjs";
import { IdControlService } from "src/app/modules/homes/body/shared-services/id-control-service/id-control.service";
import { AnalysisDatabaseService } from "../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { PaginationService } from "src/app/modules/homes/body/shared-services/pagination-service/pagination.service"
import { PaginationModel } from "../../../shared-services/pagination-service/pagination.model";
import { UserDocumentService } from "src/app/modules/communications/fe-backend-db/userDocument/userDocument.service";
import { AuthService } from "src/app/modules/communications/fe-backend-db/membership/auth.service";

@Component({
  selector: 'app-search-result-document-list',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.less']
})

export class ListDocumentsComponent implements OnInit, OnDestroy {
  orders = ['최신순', '과거순'];
  amounts = [10, 30, 50];
  form: FormGroup;

  @Input() isKeyLoaded: boolean;//키워드 검색으로 진입할 때
  @Output() relatedKeywordsReady = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  private ResultIdList: string[] = [];

  private relatedDocs: ArticleSource[][] = [];
  private countNumChange$: Observable<any> = this.elasticSearchService.getCountNumChange();
  private searchStatusChange$: Observable<boolean> = this.elasticSearchService.getSearchStatus();
  private articleChange$: Observable<ArticleSource[]> = this.elasticSearchService.getArticleChange();

  private countNumSubs: Subscription;
  private articleSubs: Subscription;

  private articleSources: ArticleSource[];
  private RelatedDocBtnToggle: Array<boolean>;
  private isResultFound: boolean;
  private isSearchDone: boolean;
  private isLoggedIn: boolean;

  private searchResultNum: string = "0";
  private searchKeyword: string;

  private currentPage: number = 1;
  private pages: number[];
  private startIndex: number;
  private totalPages: number = 1;
  private totalDocs: number;
  private pageSize: number = 10;

  constructor(
    private userDocumentService: UserDocumentService,
    private idControlService: IdControlService,
    private router: Router,
    private elasticSearchService: ElasticsearchService,
    private analysisDatabaseService: AnalysisDatabaseService,
    private formBuilder: FormBuilder,
    private paginationService: PaginationService,
    private authService: AuthService,
  ) {

    // Set articles when article has been changed
    this.articleSubs = this.articleChange$.subscribe(articles => {
      this.articleSources = articles;
      this.initialize_search();
      this.createResultIdList();
      this.setCheckboxProp();
      this.loadRelatedKeywords();
      this.form = this.formBuilder.group({
        checkArray: this.formBuilder.array([])
      });
      if (this.articleSources !== undefined) this.isResultFound = true;
      else this.isResultFound = false;
      this.elasticSearchService.setSearchStatus(true);
    });

    // Check if it is still searching
    this.searchStatusChange$.subscribe(async status => {
      this.isSearchDone = status;
    });

    // Set pagination and search result number when the number of articles has been changed
    this.countNumSubs = this.countNumChange$.subscribe(async num => {
      this.totalDocs = num;
      this.searchKeyword = this.elasticSearchService.getKeyword();
      this.searchResultNum = this.convertNumberFormat(num);
      this.loadInitialPage();
    });

    // Observe to check if user is signed out
    this.authService.getCurrentUserChange().subscribe(user => {
      this.isLoggedIn = (user != null);
    });
  }

  ngOnDestroy() {
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
  }

  ngOnInit() {
    this.isResultFound = false;
    this.isSearchDone = false;
    this.currentPage = 1;
    this.loadSearchResult();
  }

  setCheckboxProp(): void {
    for (let i in this.articleSources) {
      this.articleSources[i]['isSelected'] = false;
    }
  }

  loadSearchResult(): void {
    this.initialize_search();
  }

  setPageInfo(pageInfo: PaginationModel): void {
    this.pages = pageInfo.pages;
    this.currentPage = pageInfo.currentPage;
    this.startIndex = pageInfo.startIndex;
    this.totalPages = pageInfo.totalPages;
    console.log(this.currentPage);
  }

  async loadInitialPage(): Promise<void> {
    let pageInfo: PaginationModel = await this.paginationService.paginate(1, this.totalDocs, this.pageSize);
    this.setPageInfo(pageInfo);
  }

  async jumpPage(jumpPage: number) {
    let pageInfo: PaginationModel = await this.paginationService.jumpPage(this.totalDocs, this.pageSize, jumpPage);
    this.setPageInfo(pageInfo);
  }

  convertNumberFormat(num: number): string {
    let docCount: string = num.toString();
    if (num === 0) return docCount;

    return docCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  searchAgain(num: number): void {
    this.elasticSearchService.setNumDocsPerPage(num);
    this.elasticSearchService.searchKeyword(this.searchKeyword);
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
    this.ngOnInit();
  }

  initialize_search(): void {
    this.isResultFound = false;
    this.idControlService.clearIDList();
    this.ResultIdList = [];
  }

  createResultIdList(): void {
    this.RelatedDocBtnToggle = [];
    for (var i in this.articleSources) {
      this.ResultIdList[i] = this.articleSources[i]["_id"];
      this.RelatedDocBtnToggle.push(false);
    }
  }

  openSelectedDoc(articleSourceIdx: number, RelatedDocIdx: number): void {
    this.idControlService.selectOneID(this.relatedDocs[articleSourceIdx][RelatedDocIdx]["id"]);
    this.navToDocDetail();
  }

  openRelatedDocList(i: number): void {
    this.loadRelatedDocs(i);
    this.RelatedDocBtnToggle[i] = !this.RelatedDocBtnToggle[i];
  }

  loadRelatedDocs(idx: number): void {
    this.analysisDatabaseService.loadRelatedDocs(this.ResultIdList[idx]).then(res => {
      this.relatedDocs[idx] = res as [];
    });
  }

  async loadRelatedKeywords(): Promise<void> {
    let relatedKeywords: string[] = [];
    await this.analysisDatabaseService.getTfidfVal(this.ResultIdList).then(res => {
      let data = res as []
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        if (relatedKeywords.length < 7 && tfVal[0] !== this.searchKeyword && !relatedKeywords.includes(tfVal[0]))
          relatedKeywords.push(tfVal[0])
      }
      this.exportRelatedKeywords(relatedKeywords)
    })


    this.isKeyLoaded = true;
  }

  exportRelatedKeywords(relatedKeywords: string[]): void {
    this.relatedKeywordsReady.emit(relatedKeywords);
  }

  saveSelectedDocs(): void {
    if (this.form.value['checkArray'].length == 0) {
      alert("담을 문서가 없습니다! 담을 문서를 선택해주세요.")
    } else {
      this.userDocumentService.saveNewDoc(this.form.value['checkArray']).then(() => {
        alert("문서가 나의 문서함에 저장되었어요.")
      });
    }
  }

  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray): FormArray {
    if (isCheckAll) {
      for (let i = 0; i < this.articleSources.length; i++) {
        checkArray.push(new FormControl(this.articleSources[i]['_id']));
      }
    }
    else {
      checkArray.clear();
    }

    for (let i = 0; i < this.articleSources.length; i++) {
      this.articleSources[i]['isSelected'] = isCheckAll;
    }

    return checkArray
  }

  onCheckboxChange(e): void {
    let checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.value === "toggleAll") {
      checkArray = this.checkUncheckAll(e.target.checked, checkArray);
    }
    else {
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
    this.idControlService.selectOneID(docId);
    this.navToDocDetail();
  }

  navToDocDetail(): void {
    this.router.navigateByUrl("search/DocDetail");
  }
}