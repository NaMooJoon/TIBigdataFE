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


@Component({
  selector: 'app-search-result-document-list',
  templateUrl: './search-result-document-list.component.html',
  styleUrls: ['./search-result-document-list.component.less']
})

export class SearchResultDocumentListComponent implements OnInit, OnDestroy {

  orders = ['최신순', '과거순'];
  amounts = [10, 30, 50];

  // @Input() cat_button_choice : string[];//자료열람 : 주제 버튼 변경 되었을 때
  // @Input() searchMode : string;//자료 열람 : 처음 자료 열람으로 진입할 때
  @Input() isKeyLoaded: boolean;//키워드 검색으로 진입할 때
  @Output() related_keywords_ready = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  // @Input() is_lib_first : boolean;
  // public relatedKeywords = [];
  private RCMD_URL: string = this.ipService.get_FE_DB_ServerIp() + ":5000/rcmd";
  private search_result_doc_id_list: string[] = [];
  private keepIdList: string[] = [];
  private relatedDocs: ArticleSource[][] = [];
  readonly DEFUALT_KEYWROD: string = "북한산";


  // private keywordChange$ : Observable<string> = this.es.getKeywordChange();
  private countNumChange$: Observable<any> = this.es.getCountNumChange();
  private articleChange$: Observable<ArticleSource[]> = this.es.getArticleChange();
  private loginStatChage$ = this.auth.getLoginStatChange();

  // private keywordSubs : Subscription;
  private countNumSubs: Subscription;
  private articleSubs: Subscription;
  private loginStatSubs: Subscription;


  // private articleChangePrms : Promise<any> = this.es.getArticleChange().toPromise();
  // private articleSubscription$ : Subscription;
  // private countKeywordChange$ : Observable<number>;


  // private userSearchHistory: string[];
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
  private searchResultNum: number = 0;
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
    private rcmd: RecomandationService,
    private ipService: IpService,
    private idControl: IdControlService,
    public _router: Router,
    private http: HttpClient,
    private es: ElasticsearchService, //private cd: ChangeDetectorRef.
    private db: AnalysisDatabaseService,
    private docControl: DocumentService

  ) {
    // this.isConnected = false;
    // this.subscription = this.es.articleSource.subscribe(info => {
    //   this.articleSources = info;
    //   // //debug(info)
    // });
  }
  readonly DEBUG: boolean = true;

  debug(...arg: any[]) {
    if (this.DEBUG)
      console.log(arg);
  }

  ngOnDestroy() {
    // this.keywordSubs.unsubscribe();
    this.loginStatSubs.unsubscribe();
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
  }


  ngOnInit() {
    this.isQueryFin = false;
    this.loadingSearchResult();
  }

  /**
   * @description 유저가 키워드로 검색했을 때 검색 결과 load
      * keyword_search() process 
      * 1. 상위 시나리오에서 넘어온 모든 경우에 
      * 2. property initialize
      * 3. 키워드 업데이트 rxjs subscribe
      * 4.해당 키워드의 수 파악. rxjs subscribe : es.countByTest
      * 5. es service에서 search 후 결과 articleSource에 저장 : textSearchComplete
      * 6. articleSource로부터 결과를 이 component으로 가져고 옴 : loadSearchResult : subscribe
      * 7. id table만들기
      * 8. 연관검색어 추출
      * 9. 로그인 상태 업데이트
      * 
      * 
  */
  async loadingSearchResult() {
    this.initialize_search();//검색 결과 초기화

    this.articleSubs = this.articleChange$.subscribe(articles => {
      this.articleSources = articles
      this.create_result_doc_id_table();
      this.load_related_keywords();//검색 결과에서 연관 문서 및 키워드 호출
    });

    this.countNumSubs = this.countNumChange$.subscribe(num => {
      this.queryText = this.es.getKeyword();

      this.debug("keyword search count num change result : ", num);
      this.searchResultNum = num;
      this.loadPagesNumbers();

    })

    this.update_login_stat();
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

  async loadPagesNumbers() {
    this.pages = []; //initlize
    let pageInfo = await this.es.pagingAlgo();
    this.debug("community compo : load pages : pageInfo : ", pageInfo);
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




















  /**
   * @descriptoin 공통 함수
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   */


  /**
   * 
   *유저 로그인 관련 
   * 
   * 
   * 
   */
  /**
   * @description 현재 유저의 로그인 상태를 확인한다.
   */
  update_login_stat() {
    this.loginStatSubs = this.loginStatChage$.subscribe(stat => {//로그인 확인해서 부가기능 활성화
      this.isLogStat = stat;
    })
  }




  /**
   * 
   * 검색 결과 관련 함수들
   * 
   * 
   */


  /**
   * @description 새로운 검색을 하기 앞서서 검색 결과 초기화
   */
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
    // let temp = this.articleSources as []; //검색된 데이터들을 받음
    this.relateToggle = []; //연관 문서 여닫는 버튼 토글 초기화
    for (var i in this.articleSources) {
      this.search_result_doc_id_list[i] = this.articleSources[i]["_id"];
      this.relateToggle.push(false);
    }

    this.debug("7 create_result_doc_id table : ", this.search_result_doc_id_list)

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
    this.debug("tgglRelated")
    this.debug("toggle_update id list check : ", this.search_result_doc_id_list);

    this.load_related_docs(i); //load from flask
    this.relateToggle[i] = !this.relateToggle[i];
  }

  /**
   *
   * @param idx 
   * @description 연간문서를 실제로 호출해서 보여준다. 검색 결과에서 해당 idx번째 문서의 연관 문서를 reference table에서 불러온다.
   */
  load_related_docs(idx: number) {
    this.db.load_related_docs(this.search_result_doc_id_list[idx]).then(res => {
      // this.debug("from db : ",res)
      this.relatedDocs[idx] = res as [];

    });

  }



  /**
   * @description tfidf 알고리즘으로 도출한 각 문서의 핵심 키워드를 불러온다. 
   * 그리고 연관검색어를 생성하기 위해 맨 앞 단어들만 취합해서 유사한 검색어 array으로 담는다. 
   * 추후 word2vec알고리즘으로 변경하는 것을 생각 중...
   */

  // private keywords: any[] = [];//각 문서마다 들어갈 상위 키워드를 저장할 array

  load_related_keywords() {
    // this.debug("loadKeywords : " ,this.searchResultIdList)

    let relatedKeywords: string[] = []; //연관검색어


    this.db.get_tfidf_value(this.search_result_doc_id_list).then(res => {
      let data = res as []

      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];

        if (relatedKeywords.length < 10)
          relatedKeywords.push(tfVal[0])//현재 검색어의 연관검색어를 각 문서의 상위 키워드로 저장
      }

      this.output_realted_keywords(relatedKeywords)
      // this.debug("loadkeywords : ", data);

    })
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
    idx != undefined ?
      this.keepIdList.push(this.search_result_doc_id_list[i]) :
      this.keepIdList.splice(idx, 1);
  }


  /**
   * @description 문서 체크한 뒤 담기 버튼 누르면 실제로 담는 함수.
   */
  keepMyDoc() {
    this.auth.addMyDoc(this.keepIdList).then(() => {
      alert("문서가 나의 문서함에 저장되었어요.")
    });

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
