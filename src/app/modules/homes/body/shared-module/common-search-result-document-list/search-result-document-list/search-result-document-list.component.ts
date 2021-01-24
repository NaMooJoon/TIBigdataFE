import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription, Observable } from "rxjs";
import { IdControlService } from "../../../search/service/id-control-service/id-control.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DocumentService } from "../../../search/service/document/document.service";
import { IpService } from "src/app/ip.service";
import { RecommendationService } from "../../../search/service/recommendation-service/recommendation.service";
import { EPAuthService } from '../../../../../communications/fe-backend-db/membership/auth.service';
import { EventService } from "../../../../../communications/fe-backend-db/membership/event.service";
import { AnalysisDatabaseService } from "../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, Form } from '@angular/forms';

@Component({
  selector: 'app-search-result-document-list',
  templateUrl: './search-result-document-list.component.html',
  styleUrls: ['./search-result-document-list.component.less']
})

export class SearchResultDocumentListComponent implements OnInit, OnDestroy {
  orders = ['최신순', '과거순'];
  amounts = [10, 30, 50];
  form: FormGroup;

  @Input() isKeyLoaded: boolean;//키워드 검색으로 진입할 때
  @Output() relatedKeywordsReady = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  private ResultIdList: string[] = [];
  private selectedDocs: string[] = [];
  private relatedDocs: ArticleSource[][] = [];

  // private keywordChange$ : Observable<string> = this.es.getKeywordChange();
  private countNumChange$: Observable<any> = this.es.getCountNumChange();
  private articleChange$: Observable<ArticleSource[]> = this.es.getArticleChange();
  private loginStatChage$ = this.auth.getLoginStatChange();

  // private keywordSubs : Subscription;
  private countNumSubs: Subscription;
  private articleSubs: Subscription;
  private loginStatSubs: Subscription;
  private articleSources: ArticleSource[];

  private RelatedDocBtnToggle: Array<boolean>;
  private isResultFound = false;
  private isLogStat: Number = 0;
  private isQueryFin: boolean = false;

  private searchResultNum: string = "0";
  private pageIndex: number = 0;
  private numDocsPerPages: number = this.es.getDefaultNumDocsPerPage();

  private numPagePerBloc: number = 0;
  private numPage: number = 0;
  private numBloc: number = 0;
  private pages: number[] = [];

  private queryText: string;

  constructor(
    private auth: EPAuthService,
    private evtSvs: EventService,
    private rcmd: RecommendationService,
    private ipService: IpService,
    private idControl: IdControlService,
    public _router: Router,
    private http: HttpClient,
    private es: ElasticsearchService, //private cd: ChangeDetectorRef.
    private db: AnalysisDatabaseService,
    private docControl: DocumentService,
    private fb: FormBuilder
  ) {
  }

  ngOnDestroy() {
    this.loginStatSubs.unsubscribe();
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
  }

  ngOnInit() {
    this.isResultFound = false;
    this.isQueryFin = false;
    this.loadingSearchResult();
  }

  update_login_stat() {
    this.loginStatSubs = this.loginStatChage$.subscribe(stat => {
      this.isLogStat = stat;
    })
  }

  setCheckboxProp(): void {
    for (let i in this.articleSources) {
      this.articleSources[i]['isSelected'] = false;
    }
  }

  async loadingSearchResult() {
    this.initialize_search();
    this.articleSubs = this.articleChange$.subscribe(articles => {
      this.articleSources = articles
      this.createResultIdList();
      this.setCheckboxProp();
      this.loadRelatedKeywords();
      console.log(this.rcmd.rcmdList)
      this.form = this.fb.group({
        checkArray: this.fb.array([])
      })

      if (this.articleSources !== undefined) {
        this.isResultFound = true;
      }
      else {
        this.isResultFound = false;
      }
    });

    this.countNumSubs = this.countNumChange$.subscribe(num => {
      this.queryText = this.es.getKeyword();
      this.searchResultNum = this.convertNumberFormat(num);
      this.loadPagesNumbers();
    })
    this.update_login_stat();
  }

  convertNumberFormat(num: number): string {
    let docCount: string = num.toString();
    if (num === 0) return docCount;

    return docCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  searchAgain(num: number) {
    this.es.setNumDocsPerPage(num);
    this.es.setSearchMode(SEARCHMODE.KEY);
    this.es.searchKeyword(this.queryText);
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
    this.ngOnInit();
  }

  /**
 * 
 * 페이지 번호따오기
 */
  // TODO: Pagination algorithm is not efficient. we do not need to calculate numBloc. There will be more efficient and clear alorithm for pagination. Try other approaches later on.
  async loadPagesNumbers() {

    this.pages = []; //initlize
    let pageInfo = await this.es.setPagination();
    this.numPagePerBloc = pageInfo.numPagePerBloc;
    this.numPage = pageInfo.numPage;
    this.numBloc = pageInfo.numBloc;

    // this.pageIdx = this.numBloc  * this.numPagePerBloc;
    if (this.numBloc > 1) {
      for (let i = 0; i < this.numPagePerBloc; i++) {
        this.pages.push(i);
      }
    }
    else {
      for (let i = 0; i < this.numPage; i++) {
        this.pages.push(i);
      }
    }
  }


  /**
 * @description 가장 우선순위 높은 게시판 글들 로드하는 함수
 */
  async loadNextPage() {
    this.pageIndex += this.numDocsPerPages;
    this.es.loadListByPageIdx(this.pageIndex);
  }


  async loadPriorPage() {
    this.pageIndex -= this.numDocsPerPages;
    this.es.loadListByPageIdx(this.pageIndex);
  }

  /**
 * @description 특정 페이지 번호 누를 때 해당 페이지의 문서들 호출
 * @param i 
 */
  async choosePageNum(i: number) {
    this.es.loadListByPageIdx(i * this.numDocsPerPages);
    // window.location.reload();
    window.scroll(0, 0);//맨 위로 스크롤
  }

  private docList: {}[] = [];
  private cur_start_idx: number = 0;
  private blocIdx: number = 0;
  private pageIdx: number = 0;
  async pressNextBloc() {
    this.docList = [];
    this.blocIdx++;
    this.pages = [];
    let newStartIdx = this.blocIdx * this.numPagePerBloc;
    this.es.loadListByPageIdx(newStartIdx);
    if (this.blocIdx < this.numBloc - 1) {
      for (let i = 0; i < this.numPagePerBloc; i++) {
        this.pages.push(newStartIdx + i);
      }

    }
    else {
      let redundentNumPages = this.numPage % this.numPagePerBloc;
      for (let i = 0; i < redundentNumPages; i++) {
        this.pages.push(newStartIdx + i);
      }
    }

  }

  async pressPriorBloc() {
    this.docList = [];
    this.blocIdx--;
    this.pages = [];
    let newStartIdx = this.blocIdx * this.numPagePerBloc;
    this.es.loadListByPageIdx(newStartIdx);
    if (this.blocIdx < this.numBloc - 1) {
      for (let i = 0; i < this.numPagePerBloc; i++) {
        this.pages.push(newStartIdx + i);
      }

    }
    else {
      let redundentNumPages = this.numPage % this.numPagePerBloc;
      for (let i = 0; i < redundentNumPages; i++) {
        this.pages.push(newStartIdx + i);
      }
    }
  }

  initialize_search() {
    this.isResultFound = false;
    this.idControl.clearIDList();
    this.ResultIdList = [];
    this.selectedDocs = [];
    this.pageIndex = 0;
  }

  createResultIdList() {
    this.RelatedDocBtnToggle = [];
    for (var i in this.articleSources) {
      this.ResultIdList[i] = this.articleSources[i]["_id"];
      this.RelatedDocBtnToggle.push(false);
    }
  }

  openSelectedDoc(articleSourceIdx: number, RelatedDocIdx: number) {
    this.idControl.selecOneID(this.relatedDocs[articleSourceIdx][RelatedDocIdx]["id"]);
    this.navToDocDetail();
  }

  openRelatedDocList(i: number) {
    this.loadRelatedDocs(i); //load from flask
    this.RelatedDocBtnToggle[i] = !this.RelatedDocBtnToggle[i];
  }

  loadRelatedDocs(idx: number) {
    this.db.loadRelatedDocs(this.ResultIdList[idx]).then(res => {
      this.relatedDocs[idx] = res as [];
    });
  }

  loadRelatedKeywords() {
    let relatedKeywords: string[] = [];
    this.db.getTfidfVal(this.ResultIdList).then(res => {
      let data = res as []
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        if (relatedKeywords.length < 7 && tfVal[0] !== this.queryText && !relatedKeywords.includes(tfVal[0]))
          relatedKeywords.push(tfVal[0])
      }
      this.exportRelatedKeywords(relatedKeywords)
    })
    this.isKeyLoaded = true;
  }

  exportRelatedKeywords(relatedKeywords: string[]) {
    this.relatedKeywordsReady.emit(relatedKeywords);
  }

  saveSelectedDocs() {
    if (this.form.value['checkArray'].length == 0) {
      alert("담을 문서가 없습니다! 담을 문서를 선택해주세요.")
    } else {
      this.auth.addMyDoc(this.form.value['checkArray']).then(() => {
        alert("문서가 나의 문서함에 저장되었어요.")
      });
    }
  }

  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray) {
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

  onCheckboxChange(e) {
    let checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.value === "toggleAll") {
      console.log('toggle');
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

  view_doc_detail(docId: string) {
    console.log("article detail id: ", docId);
    this.idControl.selecOneID(docId);
    this.navToDocDetail();
  }

  navToDocDetail() {
    this._router.navigateByUrl("search/DocDetail");
  }
}