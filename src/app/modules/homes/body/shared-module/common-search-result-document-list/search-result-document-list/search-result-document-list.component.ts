import { Component,OnInit,Input,OnChanges, Output, EventEmitter, OnDestroy,} from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription, BehaviorSubject, Subject, Observable } from "rxjs";
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



  @Input() cat_button_choice : string;//자료열람 : 주제 버튼 변경 되었을 때
  @Input() is_lib_first : boolean;//자료 열람 : 처음 자료 열람으로 진입할 때
  @Input () isKeyLoaded : boolean;//키워드 검색으로 진입할 때
  @Output() related_keywords_ready = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  // @Input() is_lib_first : boolean;
  // public relatedKeywords = [];
  private RCMD_URL: string = this.ipService.get_FE_DB_ServerIp() + ":5000/rcmd";
  private search_result_doc_id_list: string[] = [];
  private keepIdList : string [] = [];
  private relatedDocs: ArticleSource[][] = [];
  readonly DEFUALT_KEYWROD : string = "북한산"
  ;
  private keywordChange$ : BehaviorSubject<string> = this.es.getKeyword();
  private loginStatChage$  = this.auth.getLoginStatChange();
  private articleChange$:  Observable<ArticleSource[]> = this.es.getArticleChange();
  private articleChangePrms : Promise<any> = this.es.getArticleChange().toPromise();
  private articleSubscription$ : Subscription;
  
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
  private isQueryTextLoaded : boolean = false;
  private searchResultNum : Number = 0;
  private pageIndex : number = 0;
  private numDocsPerPages : number = this.es.getDefaultNumDocsPerPage();

  queryText: string;
  numPagePerBloc: number;
  numPage: number;
  numBloc: number;
  pages: any;

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
    private docControl : DocumentService
    
  ) {
    // this.isConnected = false;
    // this.subscription = this.es.articleSource.subscribe(info => {
    //   this.articleSources = info;
    //   // //debug(info)
    // });
  }
  readonly DEBUG : boolean = false;

  debug(...arg:any[]){
    if(this.DEBUG)
      console.log(arg);
  }

  ngOnDestroy(): void {
    this.keywordChange$.unsubscribe();
    // this.loginStatChage$.unsubscribe();
    // this.articleChange$.unsubscribe();
  }
  ngOnChanges(){
    this.debug("0 : start change : 외부 컴포넌트에서 search-result-document-list으로 진입")

    this.isQueryTextLoaded = false;
    // this.keyword_search();

  //   let category = this.get_chosen_category();
  //   this.debug(category)
  //   this.debug("search-result-doc-list", this.cat_button_choice);
  //   this.get_category()
  //   this.discovery_search();
  //   this.debug("search resultdoc list compo : ngonchagne : this.is_all_docs : ", this.is_lib_first)
  //   this.is_lib_first = false;

  }

  ngOnInit() {
    /**
     * 시나리오 1 : 유저가 메인 검색창에서 검색 키워드로 입력한 뒤 검색 결과 창으로 진입 : ngInit. 
     * 시나이로 2 : 다른 페이지에서 뒤로보기로 검색 결과페이지로 돌아옴 : ngInit
     * 시나리오 3 : 유저가 검색 결과 창에서 새로운 키워드 입력 : ngInit 동작하지 않음. ngOnChange을 사용하기 쉽지 않은 환경이다. 
     * 검색 결과 창과 search-result-doc-list compo와는 거리가 좀 멀다. 
     * body-root 위에 search-bar + body module
     *  body module 안에 search-result 
     *    그리고 그 compo 안에 search-search-result-doc-list이 있음. input, output decorative을 사용하기에는 너무 많은 다른 컴포넌트에 의존하게 됨.
     *    
     * 
     * search component 에서 behavioral subject으로 해결.
     */





    this.debug("0 : start init : 외부 컴포넌트에서 search-result-document-list으로 진입")
    // this.debug("search resultdoc list compo : ngoninit: this.is_all_docs : ", this.is_lib_first)
    this.isQueryTextLoaded = false;
    // this.debug("search result compo")
    // this.idControl.clearAll();
    // this.debug("is_lib : ",this.is_lib_first);

    // if(this.is_lib_first)//처음 result-compo에 진입하는 경우라면 true. 아니면 keyword search compo
    //   this.initLib()
    // else
    
      this.keyword_search();
    
    // this.isLogStat = this.auth.getLogInStat()
  }







  /**
   * 
   * 
   * 
   * 
   * 
   * @description 키워드 입력해서 검색하는 함수들
   */


  /**
   * @description 유저가 키워드로 검색했을 때 검색 결과 load
      * keyword_search() process 
      * 1. 상위 시나리오에서 넘어온 모든 경우에 
      * 2. property initialize
      * 3. 키워드 업데이트 rxjs subscribe
      * 4.해당 키워드의 수 파악. rxjs subscribe
      * 5. es service에서 search 후 결과 articleSource에 저장
      * 6. articleSource로부터 결과를 이 component으로 가져고 옴
      * 7. id table만들기
      * 8. 연관검색어 추출
      * 9. 로그인 상태 업데이트
      * 
      * 
  */
  async keyword_search() {
    
    this.debug("0")
    this.initialize_search();//검색 결과 초기화
    this.debug("1")
    await this.keywordUpdate().then(()=>{
      console.log("promise test ok")

    });

    // await this.keyword_search_process();//실제 검색한 뒤 결과 받아오는 프로세스 실행 + 데이터 분석 결과도 함께 load
    
  }


  keywordUpdate(){

    return new Promise(resolve=>{
      this.keywordChange$.subscribe( async (keyword)=>{
        console.log("new keyword")
        if(keyword == ""){
          keyword = this.DEFUALT_KEYWROD;
          this.es.setKeyword(this.DEFUALT_KEYWROD);     
        }
        this.queryText = keyword;
        resolve();
      })

    })
  }
      


  /**
   * @description 실제 검색한 뒤 결과 받아오는 프로세스 실행 + 데이터 분석 결과도 함께 load
   */
  //키워드 검색으로 문서 호출하는 경우
  async keyword_search_process(){
    this.debug("3")
    // this.trans_key_and_search();//키워드를 ES에 전달

    // let keyword = this.DEFUALT_KEYWROD;
    // this.articleChangePrms.then(res => {
    //   console.log("promise : ", res);
    // })



    this.keywordChange$.subscribe( async (keyword)=>{
      console.log("queryText : ", keyword)

      // this.queryText = ;

        //debugging 혹은 검색 페이지로 곧바로 들어왔을 때 샘플 키워드로 검색. 없으면 개발할 때 불편해질 수 있음...
      // if (keyword== this.es.DEFUALT_KEYWROD) 
        // keyword  = "북한산";
      // this.alternateSearchKeyword();
      if(keyword == ""){
        // alert("default value으로 검색했습니다.");
        keyword = this.DEFUALT_KEYWROD;
        this.es.setKeyword(this.DEFUALT_KEYWROD);
        
      }
      // this.debug(this);
      // this.debug(this)

      this.queryText = keyword;

      await this.request_search_then_combine(keyword);
  
  })


    // this.debug("after transkey?");
    // this.isQueryTextLoaded = true;
    
    // this.debug("search result compoenent : loadResultPage working..." , this.isQueryTextLoaded)
    // this.debug("5")
  }






    /**
   * 
   * 페이지 번호따오기
   */

  async loadPagesNumbers(){
    let pageInfo = await this.es.pagingAlgo();
    console.log("community compo : load pages : pageInfo : ", pageInfo)
  //  * @return numPagePerBloc
  //  * @return numPage
  //  * @return numBloc  
  //  *
    this.numPagePerBloc = pageInfo.numPagePerBloc;
    this.numPage = pageInfo.numPage;
    this.numBloc = pageInfo.numBloc;

    // this.pageIdx = this.numBloc  * this.numPagePerBloc;
    if(this.numBloc > 1){
      for(let i = 0 ; i < this.numPagePerBloc; i++){
        this.pages.push(i);
      }
    }
    else{
      for(let i = 0 ; i < this.numPage; i++){
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
   * @description 유저가 입력한 키워드를 es service으로 전달해서 검색 쿼리 수행
   */
  async request_search_then_combine(keyword : string){
    this.es.countByText("post_body", keyword).then(
      count=>{
        this.searchResultNum = count;
        // this.test();
      },
      err=> console.error(err)
    )
    this.es.fullTextSearchComplete("post_body", keyword); //es.service에서 검색 후  결과를 articlesource에 저장한다.
    this.isQueryTextLoaded = true;//검색 키워드 로드된 이후에 검색어 대한 검색 결과는 몇개입니다 문구를 업데이트 한다.
    this.debug("trans key and search : search done")
    
    await this.combine_search_result();//검색 결과 호출, 데이터 분석 호출 등등 작은 기능을 묶은 함수.
    

    
    this.debug("4: trans_key_and_search done")
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
  update_login_stat(){
    this.loginStatChage$.subscribe(stat=>{//로그인 확인해서 부가기능 활성화
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
  initialize_search(){
    this.isSearchLoaded = false;//로딩 안되어있을 때 로딩 중 표시
    this.isKeyLoaded = false;//연관검색어 로딩 안되어있을 때 로딩 중 표시
    this.isRelatedLoaded = true;//plan to be removed//연관 검색어 로딩 안되었을 때 로딩 중 표시

    this.idControl.clearIdList();
    // this.userSearchHistory = [];//유저 검색 기록 표시. depreciated.
    // relatedKeywords = [];//연관검색어 담을 array
    this.search_result_doc_id_list = [];//ES에서 받은 결과 리스트의 id을 담을 array
    this.keepIdList = [];//유저가 keep 선택한 문서 id을 담을 array
    // this.debug("init done!")

    this.pageIndex = 0;
  }




  /**
   * @description 검색 결과를 불러오고, 검색 결과에서 id table을 만들고, 키워드 분석 결과를 불러오고, 유저 로그인 상태를 업데이트한다. 키워드로 검색할 때와 자료 열람으로 검색할 때 재사용하기 때문에 따로 분리.
   */
  async combine_search_result(){
    this.load_search_data();//검색 결과 es.service에서 받아옴
    this.isSearchLoaded = true;
    console.log("await done")
    this.debug("6: is search loaded : ", this.isSearchLoaded)


    this.create_result_doc_id_table();//검색 결과에서 id table 생성
    this.load_related_keywords();//검색 결과에서 연관 문서 및 키워드 호출
    this.update_login_stat()//로그인 상태를 업데이트한다. 유저 로그인 할 때 문서 담는 기능을 활성화하기 위해서 확인해야 한다.
    this.debug("8 :combine_search_result done")
    // this.debug("9 : combine_search_result id list check : " , this.searchResultIdList);

  }

  /**
   * @description 현재 검색 키워드의 검색 결과를 es.service에서 불러온다.
   */
  async load_search_data() {
    // console.log("load search data")
    // let prms = this.articleChange$.toPromise()
    // console.log("prms")
    // return await prms.then(articles =>{
    //   this.articleSources = articles;
    //     console.log("3: load_search_data done : ", this.articleSources)
    //     return;
    //   // resolve();
    // })
    this.articleSubscription$ = this.articleChange$.subscribe(articles => {
      this.debug("2: search result doc list compo : ", articles)
      this.articleSources = articles;
              console.log("3: load_search_data done : ", this.articleSources)

      // resolve();
    });
    // return new Promise(resolve => {
    // });
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

    this.debug("7 create_result_doc_id table : ", this.search_result_doc_id_list )
    
  }


  /**
   * @function select_this_doc
   * @param article_source_idx 
   * @param related_doc_idx 
   * @description 개별 문서 선택할 때 해당 문서의 아이디를 저장해둔다. 그리고 자세히 보는 페이지로 이동한다. 이동한 뒤 docDetail component에서 저장한 id에 해당하는 문서를 다시 검색하여 호출
   */
  select_this_doc(article_source_idx : number, related_doc_idx: number) {
    // this.debug("set this doc : ", article_source_idx);
    this.idControl.setIdChosen(this.relatedDocs[article_source_idx][related_doc_idx]["id"]);
    this.navToDocDetail();
  }

  /**
   * @description 각 문서의 연관문서 보기를 선택할 때 해당 문서의 index을 열린 문서 상태로 update
   */
  toggle_update(i: number) {
    this.debug("tgglRelated")
    this.debug("toggle_update id list check : " , this.search_result_doc_id_list);

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
    
      // this.es.searchById("5de1105f4b79a29a5f9880f8").then(res=>{
      //   this.debug(res)
      // })
      // this.es.searchById("5de111abb53863d63aa5522a").then(res=>{
      //   this.debug(res);
      // })
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

    let relatedKeywords : string[] = []; //연관검색어


    this.db.get_tfidf_value(this.search_result_doc_id_list).then(res => {
      // this.debug(res)
      let data = res as []
      // this.debug("loadkeywords : ", data)
      
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        // this.debug(tfVal[0])
        // this.keywords.push(tfVal)//각 문서에 상위 키워드 배열을 담는다.

        if(relatedKeywords.length < 10)
          relatedKeywords.push(tfVal[0])//현재 검색어의 연관검색어를 각 문서의 상위 키워드로 저장
      }

      this.output_realted_keywords(relatedKeywords)

    })
    // //this.debug("keywords : ",this.keywords)
    this.isKeyLoaded = true;  
  }

  output_realted_keywords(relatedKeywords : string[]){
    this.related_keywords_ready.emit(relatedKeywords);
  }





  /***
   * 문서 찜하는 기능
   */

  /**
   * @description 문서 찜하기 기능 : 체크 박스누를 때마다 상태 업데이트
   */
  checkBoxUpdate(i){
    let idx = this.keepIdList.indexOf(this.search_result_doc_id_list[i]);
    idx != undefined ? 
      this.keepIdList.push(this.search_result_doc_id_list[i]) : 
      this.keepIdList.splice(idx,1);
  }


  /**
   * @description 문서 체크한 뒤 담기 버튼 누르면 실제로 담는 함수.
   */
  keepMyDoc() {
    ////this.debug("id lists: ", this.searchResultIdList);
    this.auth.addMyDoc(this.keepIdList).then(()=>{
      alert("문서가 나의 문서함에 저장되었어요.")
    });
    // this.idControl.clearAll();

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
