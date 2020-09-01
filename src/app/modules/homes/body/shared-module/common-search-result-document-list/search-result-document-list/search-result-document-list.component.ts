import {
  Component,
  OnInit,
  Input,
  OnChanges,
  // ChangeDetectorRef,
  // Input,
  // Inject,
  // Output
} from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription } from "rxjs";
// import { Observable, of } from "rxjㄹs";
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
export class SearchResultDocumentListComponent implements OnInit,OnChanges {

  @Input() cat_button_choice : string;
  @Input() is_lib_first : boolean;
  // @Input() is_lib_first : boolean;
  public relatedKeywords = [];
  private RCMD_URL: string = this.ipService.get_FE_DB_ServerIp() + ":5000/rcmd";
  private searchResultIdList: string[] = [];
  private keepIdList : string [] = [];
  private relatedDocs: ArticleSource[][] = [];
  // private userSearchHistory: string[];
  private isSearchLoaded: boolean = false;
  private isRelatedLoaded: boolean = true;//going to be removed
  private isKeyLoaded: boolean = false;
  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  private articleSources: ArticleSource[];
  private subscription: Subscription;
  private searchKeyword: string;
  // private isToggleRelated: boolean
  private relateToggle: Array<boolean>;
  private isLogStat: Number = 0;

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
    // let category = this.get_chosen_category();
    // console.log(category)
    // console.log("search-result-doc-list", this.cat_button_choice);
    // this.get_category()
    this.discovery_search();
    console.log("search resultdoc list compo : ngonchagne : this.is_all_docs : ", this.is_lib_first)
    // this.is_lib_first = false;

  }

  ngOnInit() {
    console.log("search resultdoc list compo : ngoninit: this.is_all_docs : ", this.is_lib_first)

    // console.log("search result compo")
    // this.idControl.clearAll();
    //console.log(this.evtSvs.getSrchHst());

    if(this.is_lib_first)//처음 result-compo에 진입하는 경우라면 true. 아니면 keyword search compo
      this.initLib()
    else
      this.keyword_search();
    
    // this.isLogStat = this.auth.getLogInStat()
  }






  /**
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * 
   * @desciption 자료열람에서 검색
   * 
   * 일반적인 키워드 검색으로 하는 과정 : this.keyword_search_process()
   * 1. 유저가 입력한 키워드를 파악해서 키워드를 es에 전달해서 검색한 다음에 article source에 저장 : this.trans_key_and_search();
   * 2. 저장된 문서들을 불러옴 : load_search_result
   * 
   * 
   * 
   * 카테고리 검색에서 구분해야 하는 것.
   * 1. 맨 처음 lib에 진입
   *    이미 카테고리가 전체로 선택되어 있다.
   *    전체 문서 검색한다 : es.service.allSearch()
   *    해당 문서들을 article source에 저장한다.
   *    
   * 2. 카테고리 선택
   *    선택한 종류를 파악한다.
   *    해당 종류에 대해 fe-backend에서 문서들의 id을 받는다.
   *    받은 id을 가지고 multIdSearch을 사용해서 article source에 저장한다.
   * 
   *    
   * 
   * 공통으로 사용하는 함수 : article source에 저장되기만 하면 그 이후로는 동일한 함수 사용한다.
   * 
   * 실제 keyword search을 기준으로 하면
   * this.initialize_search();//공통
    await this.keyword_search_process();//only keywordSearch
      여기서 article source에서 받아오는 함수는 load_search_result이다.
    this.create_result_doc_id_table();//검색 결과에서 id table 생성. 공통
    this.additional_saerch_feature();//공통
   * 
   */



  async discovery_search(){

    this.initialize_search();



    
    await this.discovery_search_process();
    await this._common_process();
    // this.create_result_doc_id_table();//검색 결과에서 id table 생성
    // this.additional_saerch_feature();
    // this.create_topic_id_table();
    // console.log(await );
    // this.create_topic_id_table(docs);
  }

  async discovery_search_process(){
    // console.log("search resultdoc list compo : this.is_all_docs : ", this.is_all_docs)
    // if(this.is_all_docs){
    //   this.search_all();
    // }
    // else{
      this.search_category();
    // }

    
  }

  async initLib(){
    await this.search_all();
    console.log("all search")
    this._common_process();
  }

  async search_all(){
      console.log("search result docs list compo : sarch_all init");
      this.es.allSearch();
      // await this.load_search_result();//검색 결과 es.service에서 받아옴
  }

  async search_category(){
    let category = this.get_chosen_category();
    let docs_id = await this.load_topic_docs_id(category)//현재 토픽에 해당하는 내용을 불러온다.
    this.es.MultIdSearch(docs_id);
  }


  get_chosen_category(){
    return this.cat_button_choice;
  }

  async load_topic_docs_id(category){
    // console.log(category)
    return await this.db.getOneTopicDocs(category) as [];
  }



  // create_topic_id_table(raw_result : any){
  //   for(var i = 0 ; i < raw_result.length; i++){
  //     this.searchResultIdList[i] = raw_result[i];
  //   }
    
  // }





  /**
   * 
   * 
   * 
   * 
   * 
   * @description 키워드 입력해서 검색하는 함수들
   */


  async keyword_search() {
    // console.log("search result compoenent : loadResultPage working...")


    this.initialize_search();
    await this.keyword_search_process();
    
  }



  async _common_process(){

    await this.load_search_result();//검색 결과 es.service에서 받아옴
    this.create_result_doc_id_table();//검색 결과에서 id table 생성
    this.additional_saerch_feature();
  }


  //키워드 검색으로 문서 호출하는 경우
  async keyword_search_process(){
    this.trans_key_and_search();//키워드를 ES에 전달
    await this._common_process();
  }



  /**
   * @description 유저가 입력한 키워드를 es service으로 전달해서 검색 쿼리 수행
   */
  trans_key_and_search(){
    let queryText = this.es.getKeyword();//현재 선택된 검색어 받아옴
    //debugging 혹은 검색 페이지로 곧바로 들어왔을 때 샘플 키워드로 검색
    if (this.ipService.get_FE_DB_ServerIp() == this.ipService.getDevIp()) {
      if (this.es.getKeyword() == undefined) {
        this.es.setKeyword("북한산");//다른 컴포넌트 혹은 서비스에서 사용할 수 있기 때문에 새로 등록
        this.queryText = this.es.getKeyword();
      }
    }   
    this.es.fullTextSearch("post_body", queryText); //검색 후 es.service에서 articlesource에 저장되어 있다.
  }

  



  /**
   * @description 현재 검색 키워드의 검색 결과를 es.service에서 불러온다.
   */
  load_search_result() {

    return new Promise(resolve => {
      this.es.articleInfo$.subscribe(articles => {
        // console.log("search result doc list compo : ", articles)
        this.articleSources = articles;
        this.isSearchLoaded = true;
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

    // console.log("create_result_doc_id table : ", this.searchResultIdList )
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


  additional_saerch_feature(){
    this.loadKeywords();//검색 결과에서 연관 문서 및 키워드 호출
    this.auth.getLogInObs().subscribe(stat=>{//로그인 확인해서 부가기능 활성화
      this.isLogStat = stat;
    })
  }





  initialize_search(){
    this.isSearchLoaded = false;//로딩 안되어있을 때 로딩 중 표시
    this.isKeyLoaded = false;//연관검색어 로딩 안되어있을 때 로딩 중 표시
    this.isRelatedLoaded = true;//plan to be removed//연관 검색어 로딩 안되었을 때 로딩 중 표시

    this.idControl.clearIdList();
    // this.userSearchHistory = [];//유저 검색 기록 표시. depreciated.
    this.relatedKeywords = [];//연관검색어 담을 array
    this.searchResultIdList = [];//ES에서 받은 결과 리스트의 id을 담을 array
    this.keepIdList = [];//유저가 keep 선택한 문서 id을 담을 array
  }


  /***
   * 문서 찜하는 기능
   */
  boxChange(i){
    let idx = this.keepIdList.indexOf(this.searchResultIdList[i]);
    idx != undefined ? 
      this.keepIdList.push(this.searchResultIdList[i]) : 
      this.keepIdList.splice(idx,1);
  }

  keepMyDoc() {
    ////console.log("id lists: ", this.searchResultIdList);
    this.auth.addMyDoc(this.keepIdList).then(()=>{
      alert("문서가 나의 문서함에 저장되었어요.")
    });
    // this.idControl.clearAll();

  }


  navToDocDetail() {
    this._router.navigateByUrl("search/DocDetail");
  }


  /**
   * @function setThisDoc
   * @param article_source_idx 
   * @param related_doc_idx 
   * @description 개별 문서 선택할 때 해당 문서 자세히 보는 페이지로 이동
   */
  setThisDoc(article_source_idx : number, related_doc_idx: number) {
    // console.log("set this doc : ", article_source_idx);
    this.idControl.setIdChosen(this.relatedDocs[article_source_idx][related_doc_idx]["id"]);
    this.navToDocDetail();
  }

  tgglRelated(i: number) {
    //console.log("tgglRelated")
    this.loadRelatedDocs(i); //load from flask
    this.relateToggle[i] = !this.relateToggle[i];
  }

  /**
   *
   * @param idx 
   * @description 검색 결과에서 해당 idx번째 문서의 연관 문서를 reference table에서 불러온다.
   */
  loadRelatedDocs(idx: number) {
    // this.relatedDocs[idx]=[];
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


  //각 문서마다 들어갈 상위 키워드를 저장할 array
  private keywords: any[] = [];

  loadKeywords() {
    // console.log("loadKeywords : " ,this.searchResultIdList)
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
    })
    // //console.log("keywords : ",this.keywords)
    this.isKeyLoaded = true;  
  }






}
