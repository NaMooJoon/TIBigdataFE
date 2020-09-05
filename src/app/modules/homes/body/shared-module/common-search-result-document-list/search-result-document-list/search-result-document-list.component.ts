import { Component,OnInit,Input,OnChanges, Output, EventEmitter,} from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription } from "rxjs";
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

export class SearchResultDocumentListComponent implements OnInit {

  @Input() cat_button_choice : string;//자료열람 : 주제 버튼 변경 되었을 때
  @Input() is_lib_first : boolean;//자료 열람 : 처음 자료 열람으로 진입할 때
  @Input () isKeyLoaded : boolean;//키워드 검색으로 진입할 때
  @Output() related_keywords_ready = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  // @Input() is_lib_first : boolean;
  public relatedKeywords = [];
  private RCMD_URL: string = this.ipService.get_FE_DB_ServerIp() + ":5000/rcmd";
  private searchResultIdList: string[] = [];
  private keepIdList : string [] = [];
  private relatedDocs: ArticleSource[][] = [];
  // private userSearchHistory: string[];
  private isSearchLoaded: boolean = false;
  private isRelatedLoaded: boolean = true;//going to be removed
  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  private articleSources: ArticleSource[];
  private subscription: Subscription;
  private searchKeyword: string;
  // private isToggleRelated: boolean
  private relateToggle: Array<boolean>;
  private isLogStat: Number = 0;
  private isQueryTextLoaded : boolean = false;
  queryText: string;

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
    this.subscription = this.es.articleInfo$.subscribe(info => {
      this.articleSources = info;
      // //console.log(info)
    });
  }
  ngOnChanges(){
    console.log("0 : start change : 외부 컴포넌트에서 search-result-document-list으로 진입")

    this.isQueryTextLoaded = false;
    this.keyword_search();

  //   let category = this.get_chosen_category();
  //   console.log(category)
  //   console.log("search-result-doc-list", this.cat_button_choice);
  //   this.get_category()
  //   this.discovery_search();
  //   console.log("search resultdoc list compo : ngonchagne : this.is_all_docs : ", this.is_lib_first)
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
     */


    console.log("0 : start init : 외부 컴포넌트에서 search-result-document-list으로 진입")
    // console.log("search resultdoc list compo : ngoninit: this.is_all_docs : ", this.is_lib_first)
    this.isQueryTextLoaded = false;
    // console.log("search result compo")
    // this.idControl.clearAll();
    // console.log("is_lib : ",this.is_lib_first);

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
   */
  async keyword_search() {
    console.log("0")
    this.initialize_search();//검색 결과 초기화
    console.log("1")
    await this.keyword_search_process();//실제 검색한 뒤 결과 받아오는 프로세스 실행 + 데이터 분석 결과도 함께 load
    
  }


  /**
   * @description 실제 검색한 뒤 결과 받아오는 프로세스 실행 + 데이터 분석 결과도 함께 load
   */
  //키워드 검색으로 문서 호출하는 경우
  async keyword_search_process(){
    console.log("3")
    this.trans_key_and_search();//키워드를 ES에 전달
    this.isQueryTextLoaded = true;
    // console.log("search result compoenent : loadResultPage working..." , this.isQueryTextLoaded)
    console.log("5")
    await this.combine_search_result();//검색 결과 호출, 데이터 분석 호출 등등 작은 기능을 묶은 함수.
  }











  /**
   * @description 유저가 입력한 키워드를 es service으로 전달해서 검색 쿼리 수행
   */
  async trans_key_and_search(){
    this.queryText = await this.es.getKeywordChange() as string;//현재 선택된 검색어 받아옴
    // console.log("queryText : ", this.queryText)

    //debugging 혹은 검색 페이지로 곧바로 들어왔을 때 샘플 키워드로 검색. 없으면 개발할 때 불편해질 수 있음...
    if ( this.queryText== undefined) 
      this.queryText = "북한산"
      // this.alternateSearchKeyword();
      // console.log("queryText : ", this.queryText)

    this.es.fullTextSearch("post_body", this.queryText); //es.service에서 검색 후  결과를 articlesource에 저장한다.
    this.isQueryTextLoaded = true;//검색 키워드 로드된 이후에 검색어 대한 검색 결과는 몇개입니다 문구를 업데이트 한다.
    console.log("4: trans_key_and_search done")
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
  updateLoginStat(){
    this.auth.getLogInObs().subscribe(stat=>{//로그인 확인해서 부가기능 활성화
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
    this.relatedKeywords = [];//연관검색어 담을 array
    this.searchResultIdList = [];//ES에서 받은 결과 리스트의 id을 담을 array
    this.keepIdList = [];//유저가 keep 선택한 문서 id을 담을 array
    console.log("init done!")
  }




  /**
   * @description 검색 결과를 불러오고, 검색 결과에서 id table을 만들고, 키워드 분석 결과를 불러오고, 유저 로그인 상태를 업데이트한다. 키워드로 검색할 때와 자료 열람으로 검색할 때 재사용하기 때문에 따로 분리.
   */
  async combine_search_result(){
    await this.load_search_data();//검색 결과 es.service에서 받아옴
    this.isSearchLoaded = true;
    console.log("6: is search loaded : ", this.isSearchLoaded)
    // console.log("debug1", this.isSearchLoaded)
    this.create_result_doc_id_table();//검색 결과에서 id table 생성
    this.loadKeywords();//검색 결과에서 연관 문서 및 키워드 호출
    this.updateLoginStat()//로그인 상태를 업데이트한다. 유저 로그인 할 때 문서 담는 기능을 활성화하기 위해서 확인해야 한다.
    console.log("8 :combine_search_result done")
    console.log("combine_search_result id list check : " , this.searchResultIdList);

  }

  /**
   * @description 현재 검색 키워드의 검색 결과를 es.service에서 불러온다.
   */
  load_search_data() {
    return new Promise(resolve => {
      this.es.articleInfo$.subscribe(articles => {
        console.log("2: search result doc list compo : ", articles)
        this.articleSources = articles;
        
        console.log("3: load_search_data done")
        resolve();
      });
    });
  }

  /**
   * @description 현재 검색 결과 문서 리스트의 id table을 만든다.
   */
  create_result_doc_id_table() {
    // let temp = this.articleSources as []; //검색된 데이터들을 받음
    this.relateToggle = []; //연관 문서 여닫는 버튼 토글 초기화
    for (var i in this.articleSources) {
      this.searchResultIdList[i] = this.articleSources[i]["_id"];
      this.relateToggle.push(false);
    }

    console.log("7 create_result_doc_id table : ", this.searchResultIdList )
    
  }


  /**
   * @function setThisDoc
   * @param article_source_idx 
   * @param related_doc_idx 
   * @description 개별 문서 선택할 때 해당 문서의 아이디를 저장해둔다. 그리고 자세히 보는 페이지로 이동한다. 이동한 뒤 docDetail component에서 저장한 id에 해당하는 문서를 다시 검색하여 호출
   */
  setThisDoc(article_source_idx : number, related_doc_idx: number) {
    // console.log("set this doc : ", article_source_idx);
    this.idControl.setIdChosen(this.relatedDocs[article_source_idx][related_doc_idx]["id"]);
    this.navToDocDetail();
  }

  /**
   * @description 각 문서의 연관문서 보기를 선택할 때 해당 문서의 index을 열린 문서 상태로 update
   */
  toggle_update(i: number) {
    console.log("tgglRelated")
    console.log("toggle_update id list check : " , this.searchResultIdList);

    this.loadRelatedDocs(i); //load from flask
    this.relateToggle[i] = !this.relateToggle[i];
  }

  /**
   *
   * @param idx 
   * @description 연간문서를 실제로 호출해서 보여준다. 검색 결과에서 해당 idx번째 문서의 연관 문서를 reference table에서 불러온다.
   */
  loadRelatedDocs(idx: number) {
    // this.relatedDocs[idx]=[];
    console.log("load related docs : " , this.searchResultIdList);

    console.log("load related docs : " , this.searchResultIdList[idx]);
    this.db.getRelatedDocs(this.searchResultIdList[idx]).then(res => {
      // console.log("from db : ",res)
      this.relatedDocs[idx] = res as [];
    
      // this.es.searchById("5de1105f4b79a29a5f9880f8").then(res=>{
      //   console.log(res)
      // })
      // this.es.searchById("5de111abb53863d63aa5522a").then(res=>{
      //   console.log(res);
      // })
    });
   
  }


  
    /**
     * @description 각 문서의 핵심 키워드를 불러온다. 그리고 현재 검색어와 유사한 검색어 array으로 담는다. 추후 word2vec알고리즘으로 변경하는 것을 생각 중...
     */
  
  private keywords: any[] = [];//각 문서마다 들어갈 상위 키워드를 저장할 array

  loadKeywords() {
    console.log("loadKeywords : " ,this.searchResultIdList)
    this.db.getTfidfValue(this.searchResultIdList).then(res => {
      // console.log(res)
      let data = res as []
      // console.log("loadkeywords : ", data)
      
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        // console.log(tfVal[0])
        this.keywords.push(tfVal)//각 문서에 상위 키워드 배열을 담는다.

        if(this.relatedKeywords.length < 10)
          this.relatedKeywords.push(tfVal[0])//현재 검색어의 연관검색어를 각 문서의 상위 키워드로 저장
      }

      this.related_keywords_ready.emit(this.relatedKeywords);
    })
    // //console.log("keywords : ",this.keywords)
    this.isKeyLoaded = true;  
  }






  /***
   * 문서 찜하는 기능
   */

  /**
   * @description 문서 찜하기 기능 : 체크 박스누를 때마다 상태 업데이트
   */
  checkBoxUpdate(i){
    let idx = this.keepIdList.indexOf(this.searchResultIdList[i]);
    idx != undefined ? 
      this.keepIdList.push(this.searchResultIdList[i]) : 
      this.keepIdList.splice(idx,1);
  }


  /**
   * @description 문서 체크한 뒤 담기 버튼 누르면 실제로 담는 함수.
   */
  keepMyDoc() {
    ////console.log("id lists: ", this.searchResultIdList);
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
