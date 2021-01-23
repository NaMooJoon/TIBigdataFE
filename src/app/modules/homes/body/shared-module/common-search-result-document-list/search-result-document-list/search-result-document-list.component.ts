import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription, Observable } from "rxjs";
import { IdControlService } from "../../../search/service/id-control-service/id-control.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DocumentService } from "../../../search/service/document/document.service";
import { IpService } from "src/app/ip.service";
import { RecomandationService } from "../../../search/service/recommandation-service/recommandation.service";
import { EPAuthService } from '../../../../../communications/fe-backend-db/membership/auth.service';
import { EventService } from "../../../../../communications/fe-backend-db/membership/event.service";
import { AnalysisDatabaseService } from "../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

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
  @Output() related_keywords_ready = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  private search_result_doc_id_list: string[] = [];
  private keepIdList: string[] = [];
  private relatedDocs: ArticleSource[][] = [];

  // private keywordChange$ : Observable<string> = this.es.getKeywordChange();
  private countNumChange$: Observable<any> = this.es.getCountNumChange();
  private articleChange$: Observable<ArticleSource[]> = this.es.getArticleChange();
  private loginStatChage$ = this.auth.getLoginStatChange();

  // private keywordSubs : Subscription;
  private countNumSubs: Subscription;
  private articleSubs: Subscription;
  private loginStatSubs: Subscription;

  private isSearchLoaded: boolean = false;
  private isRelatedLoaded: boolean = true;//going to be removed
  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  private articleSources: ArticleSource[];
  private subscription: Subscription;
  // private isToggleRelated: boolean
  private relateToggle: Array<boolean>;
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
  private isResultFound = false;

  constructor(
    private auth: EPAuthService,
    private evtSvs: EventService,
    private rcmd: RecomandationService,
    private ipService: IpService,
    private idControl: IdControlService,
    public _router: Router,
    private http: HttpClient,
    private es: ElasticsearchService, //private cd: ChangeDetectorRef.
    private db: AnalysisDatabaseService,
    private docControl: DocumentService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
  }

  ngOnDestroy() {
    // this.keywordSubs.unsubscribe();
    this.loginStatSubs.unsubscribe();
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
  }

  ngOnInit() {
    console.log("onInit");
    this.isResultFound = false;
    this.isQueryFin = false;
    this.loadingSearchResult();
  }

  async loadingSearchResult() {
    this.initialize_search();
    this.articleSubs = this.articleChange$.subscribe(async articles => {
      console.log("update: " + articles);
      this.articleSources = articles
      this.create_result_doc_id_table();
      this.load_related_keywords();

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
  // TODO: Pagination algorithm is not efficient. we do not need to caculate numBloc. There will be more efficient and clear alorithm for pagination. Try other approaches later on.
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

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
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

    console.log(checkArray)
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


  /**
   * 다음 블록 버튼 눌렀을 때
   */

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



    // this.docList = await this.cm_svc.loadListByPageIdx(newStartIdx);
    // this.debug(this.docList);
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
    if (this.blocIdx < this.numBloc - 1) {//bloc 시작 Index = 0. numBloc = 2라면 1페이지까지가 꽉 찬다.
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

  update_login_stat() {
    this.loginStatSubs = this.loginStatChage$.subscribe(stat => {//로그인 확인해서 부가기능 활성화
      this.isLogStat = stat;
    })
  }

  initialize_search() {
    this.isSearchLoaded = false;//로딩 안되어있을 때 로딩 중 표시
    this.isKeyLoaded = false;//연관검색어 로딩 안되어있을 때 로딩 중 표시
    this.isRelatedLoaded = true;//plan to be removed//연관 검색어 로딩 안되었을 때 로딩 중 표시

    this.idControl.clearIDList();
    // this.userSearchHistory = [];//유저 검색 기록 표시. depreciated.
    // relatedKeywords = [];//연관검색어 담을 array
    this.search_result_doc_id_list = [];//ES에서 받은 결과 리스트의 id을 담을 array
    this.keepIdList = [];//유저가 keep 선택한 문서 id을 담을 array
    // this.debug("init done!")

    this.pageIndex = 0;
  }




  /**
   * @description 현재 검색 결과 문서 리스트의 id table을 만든다.
   */
  create_result_doc_id_table() {
    this.relateToggle = []; //연관 문서 여닫는 버튼 토글 초기화
    for (var i in this.articleSources) {
      this.search_result_doc_id_list[i] = this.articleSources[i]["_id"];
      this.relateToggle.push(false);
    }
  }


  /**
   * @function select_this_doc
   * @param article_source_idx 
   * @param related_doc_idx 
   * @description 개별 문서 선택할 때 해당 문서의 아이디를 저장해둔다. 그리고 자세히 보는 페이지로 이동한다. 이동한 뒤 docDetail component에서 저장한 id에 해당하는 문서를 다시 검색하여 호출
   */
  select_this_doc(article_source_idx: number, related_doc_idx: number) {
    // this.debug("set this doc : ", article_source_idx);
    this.idControl.selecOneID(this.relatedDocs[article_source_idx][related_doc_idx]["id"]);
    this.navToDocDetail();
  }

  /**
   * @description 각 문서의 연관문서 보기를 선택할 때 해당 문서의 index을 열린 문서 상태로 update
   */
  toggle_update(i: number) {
    this.loadRelatedDocs(i); //load from flask
    this.relateToggle[i] = !this.relateToggle[i];
  }

  /**
   *
   * @param idx 
   * @description 연간문서를 실제로 호출해서 보여준다. 검색 결과에서 해당 idx번째 문서의 연관 문서를 reference table에서 불러온다.
   */
  loadRelatedDocs(idx: number) {
    this.db.loadRelatedDocs(this.search_result_doc_id_list[idx]).then(res => {
      this.relatedDocs[idx] = res as [];
    });

  }

  load_related_keywords() {
    let relatedKeywords: string[] = []; //연관검색어
    this.db.getTfidfVal(this.search_result_doc_id_list).then(res => {
      let data = res as []

      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];

        if (relatedKeywords.length < 7 && tfVal[0] !== this.queryText && !relatedKeywords.includes(tfVal[0]))
          relatedKeywords.push(tfVal[0])//현재 검색어의 연관검색어를 각 문서의 상위 키워드로 저장
      }

      this.output_realted_keywords(relatedKeywords)
    })
    console.log(relatedKeywords);
    this.isKeyLoaded = true;
  }

  output_realted_keywords(relatedKeywords: string[]) {
    this.related_keywords_ready.emit(relatedKeywords);
  }

  /***
   * 문서 찜하는 기능
   */

  /**
   * @description 문서 찜하기 기능 : 체크 박스누를 때마다 상태 업데이트
   */
  checkBoxUpdate(i) {
    let idx = this.keepIdList.indexOf(this.search_result_doc_id_list[i]);

    idx == -1 ?
      this.keepIdList.push(this.search_result_doc_id_list[i]) :
      this.keepIdList.splice(idx, 1);
  }

  /**
   * @description 문서 체크한 뒤 담기 버튼 누르면 실제로 담는 함수.
   */
  keepMyDoc() {
    if (this.keepIdList.length == 0) {
      alert("담을 문서가 없습니다! 담을 문서를 선택해주세요.")
    } else {
      // 이미 담긴 문서 알림창 다르게. 
      this.auth.addMyDoc(this.keepIdList).then(() => {
        alert("문서가 나의 문서함에 저장되었어요.")
      });
    }
  }

  view_doc_detail(docId: string) {
    console.log("article detail id: ", docId);
    this.idControl.selecOneID(docId);
    this.navToDocDetail();

    // this.docId = this.article["_id"];
    // console.log(this.docId);

  }
  /**
   * 네비게이션 함수
   */

  /**
   * @description 개별 문서 선택했을 때 해당 문서 더 자세히 보기 페이지로 이동
   */
  navToDocDetail() {
    this._router.navigateByUrl("search/DocDetail");
  }


}
