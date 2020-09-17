import { Injectable } from "@angular/core";
import { Client } from "elasticsearch-browser";
import * as elasticsearch from "elasticsearch-browser";
//import { InheritDefinitionFeature } from '@angular/core/src/render3';
import { ArticleSource } from "src/app/modules/homes/body/shared-module/common-search-result-document-list/article/article.interface";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { IpService } from 'src/app/ip.service'
import { query } from '@angular/animations';

class searchOption{
  static readonly  title = "post_title";
  static readonly date = "post_date";
  static readonly inst = "published_institution_url";
  static readonly author = "post_writer";
  static readonly body = "post_body";
}

/**
 * 
 * 검색 결과를 save_search_result() 을 통해서 article source에 저장한다.
 * 각 검색 함수는 따로 있고, save_search_result을 적용시면 article source에 해당 검색 결과를 저장한다. 
 * 검색 결과를 저장이 완료된 함수와, 실제 검색을 요청하는 함수를 구분할 필요성이 있음.
 * 그래야 덜 헷갈릴 듯.
 * 
 * ~~~Search : 검색 결과를 article_source에 저장까지 완료한 함수들.
 */

@Injectable({
  providedIn: "root"
})
export class ElasticsearchService {
  private client: Client;
  private articleSource : BehaviorSubject<ArticleSource[]> = new BehaviorSubject<ArticleSource[]>(undefined);
  private countNum : BehaviorSubject<number> = new BehaviorSubject<number>(0);
  readonly DEFUALT_KEYWROD : string = "";
  private keywordChange : BehaviorSubject<string> = new BehaviorSubject(this.DEFUALT_KEYWROD);//to stream to subscribers

  // articleSource = this.articleSource.asObservable();

  // private searchKeyword = new BehaviorSubject<string>();
  // private isLogInObs$: BehaviorSubject<logStat> = new BehaviorSubject(logStat.unsigned);//to stream to subscribers

  // private searchKeyword$ : BehaviorSubject<string> = new BehaviorSubject(this.DEFUALT_KEYWROD);//to stream to subscribers
  private keyword : string = this.DEFUALT_KEYWROD;
  private readonly  DOC_NUM_PER_EACH_PAGE : number = 10;

  constructor(private ipSvc : IpService) {
    if (!this.client) {
      this._connect();
    }
  }

  searchKeyword(keyword : string){
    console.log("key update : ", keyword)
    this.keyword = keyword;
    this.keywordChange.next(keyword);
    this.fullTextSearchComplete("post_body", keyword);
    this.countByTextComplete("post_body", keyword);
  }

  
  getCountNumChange() : Observable<any> {
    return this.countNum.asObservable();
  }

  getArticleChange(){
    return this.articleSource;
  }

  /**
   * @function setKeyword
   * 키워드를 이 서비스에 저장한다. 저장한 이후에 검색 가능.
   * 저장할 키워드 string
   */
  setKeyword(keyword: string) :void {
    
    // return new Promise(resolve => {
    //   console.log("keyword update to ", keyword);
    //   resolve()
    // })
    if(keyword != this.keyword){
      this.keyword = keyword;
      // this.searchKeyword$.next(this.keyword);
    }

  }


  getKeyword() : string{
    // console.log("es : getkey")
    // return new Promise(resolve=>{
      return this.keyword;
        // resolve(res);
      // })
    // })
  }

  getKeywordChange() {
    return this.keywordChange;
  }

  private queryalldocs = {
    query: {
      match_all: {}
    }
  };


  /**
   * @function search_all_docs
   * @description 모든 문서를 반환
   */
  search_all_docs(): any {
    return this.client.search({
      body: this.queryalldocs,
      filterPath: ["hits.hits._source"]
    })
  }


  /**
   * @function allSearch 
   * @description 모든 문서를 검색하는 함수를 실행한 뒤 article source까지 저장
   */
  allSearchComplete() : void{
    this.save_search_result_from_hook(this.search_all_docs());
  }

  /**
   * @function fullTextSearch
   * es에서 키워드 검색하는 함수
   * @param _field
   * es에서 검색할 필드
   * i.e. post_body : 문서 내용에서 키워드 검색
   *      post_ttile? : 문서 제목에서 키워드 검색
   * @param _queryText
   * es에서 검색할 키워드 텍스트
   */
  fullTextSearchComplete(_field  : string, _queryText : string, startIndex? : number, docSize? : number) : void{
    if(!_field)
      _field = searchOption.body;
    if(!_queryText)
      _queryText = this.keyword;
    this. save_search_result_from_hook(this.searchByText(_field, _queryText, startIndex, docSize));
  }



  


  /**
   * @function searchByText
   * @description search by keyword text matching
   */
  searchByText(_field, _queryText, startIndex? : number, docSize? : number) : Promise<any> {
    if(!startIndex)
      startIndex = 0;
    if(!docSize)
      docSize = this.DOC_NUM_PER_EACH_PAGE;


    return this.client
      .search({
        from: startIndex,
        size: docSize,
        filterPath: [
          "hits.hits._source",
          "hits.hits._id",
          "hits.total",
          "_scroll_id"
        ],
        body: {
          query: {
            match_phrase_prefix: {
              [_field]: _queryText
            }
          }
        },
        _source: [
          "post_title",
          "post_date",
          "published_institution_url",
          "post_writer",
          "post_body"
        ]
      })
  }


  countByText(_field  : string, _queryText : string) : Promise<any>{
    if(!_field)
      _field = searchOption.body;
    if(!_queryText)
      _queryText = this.keyword;
    return this.client.count({
      body: {
        query: {
          match_phrase_prefix: {
            [_field]: _queryText
          }
        }
      },
    })
  }

  countByTextComplete(field : string, queryText : string) : void{
    this.countByText(field, queryText).then( countNum =>
      this.countNum.next(countNum)
    )
  }

  getCountNumber(field, queryText) : Promise<number>{
    return this.countByText(field, queryText).then(
      res=>{
        return res.count;
      },
      err=> console.error(err)
    )
  }
  

  /**
   * @function IdSearch
   * @param id : string
   * @description ES에서 검색하고자 하는 문서의 id을 검색해서 article source에 저장까지 완료
   */
  IdSearchComplete(id : string) : void {
    this.save_search_result_from_hook(this.searchById(id));
  }

  /**
   * @function searchById
   * id을 기준으로 db에서 검색한 결과를 바로 반환해준다.
   * 
   * @param id : 검색할 id string
   */
  searchById(id: string)  : Promise<any>{

    return this.client.search({
      filterPath: ["hits.hits"],
      body: {
        query: {
          term: {
            _id: id
          }
        }
      },
      _source: [
        "post_title",
        "post_date",
        "published_institution_url",
        "post_writer",
        "post_body"
      ]
    });
  }


  /**
   * @function MultIdSearch
   * @param id : string array
   * @description ES에서 검색하고자 하는 문서의 id array을 검색해서 article source에 저장까지 완료
   */
  MultIdSearchComplete(ids : string[]) : void {
    this.save_search_result_from_hook(this.searchByManyId(ids));
  }

  /**
   * @function searchByManyId
   * id을 기준으로 db에서 검색한 결과를 바로 반환해준다.
   * 
   * @param id : 검색할 id string
   */
  searchByManyId(ids: string[]) {
    // console.log("es ts: the num of ids : "+ids.length);
    return this.client.search({
      // filterPath: ["hits.hits"],
      // index: "nkdb",
      // from:0,//not work. github KUBiC issue # 34
      // size: 10,//not work.
      body: {
        query: {
          terms: {
            _id: ids
          }
        }
      },
      _source: [
        "post_title",
        "post_date",
        "published_institution_url",
        "post_writer",
        "post_body"
      ]
    });
  }

  save_search_result_from_hook(hookFunc) : void{
    hookFunc.then(response => {
      //검색 후 observable에 저장
      // console.log(response)
      this.transfer_docs_to_article_source(response.hits.hits);
    });
  }

    /**
   * @function transfer_docs_to_article_source
   * 검색 결과를 observable에 저장하는 함수.
   * 저장을 해줘야 subscribe 함수를 통해서 subscriber들이 받아올 수 있다.
   * 비동기 함수로 유용하게 사용!
   * @param info
   * 저장할 article array
   *
   */
  transfer_docs_to_article_source(info: ArticleSource[]) : void {
    this.articleSource.next(info);
    // console.log("saved : ", this.articleSource);
  }


  /**
   * page Algo
   */


  getDefaultNumDocsPerPage() : number{
    return this.DOC_NUM_PER_EACH_PAGE;
  }


   /**
   * pseudo code 
      number of docs per page ← N
      number of pages ← number of total docs / N
      if number of total docs % N > 0:
        then number of pages ++
      number of pages per bloc ← M
      number of bloc ← number of pages / M
      if number of pages % M > 0:
        then number of bloc ++

   * 
   * 
   */

  /**
   * 
   * @param res 
   * 처음에 numPagePerBloc만큼만 보여준다.
   * pageIdx % numPagePerBloc = 0이 되면 다음 bloc으로 이동. bloc idx update. bloc idx의 최대값은 numBloc이다.
   * pageIdx 의 최대값ㅂ은 numPage이다.
   * @return numPagePerBloc
   * @return numPage
   * @return numBloc
   */
  async pagingAlgo() : Promise<any>{
    //number of docs per page ← N
    // use predefined this.DOC_NUM_PER_EACH_PAGE;
    //number of pages ← number of total docs / N
    let numTotalDocs = await this.getCountNumber("post_body", this.keyword);
    // let numTotalDocs = res.payload.data;
    // console.log("community service numTotalDocs : ", res.payload.data);

    let numPage = Math.floor(numTotalDocs / this.DOC_NUM_PER_EACH_PAGE);
    //if number of total docs % N > 0:
    if (numTotalDocs % this.DOC_NUM_PER_EACH_PAGE > 0)
    //  then number of pages ++
      numPage++;  
    //number of pages per bloc ← M
    // let numPagePerBloc = this.DOC_NUM_PER_EACH_PAGE;
    let numPagePerBloc = 10;
    //number of bloc ← number of pages / M
    let numBloc = Math.floor(numPage / numPagePerBloc);
    //if number of pages % M > 0:
    if(numPage % numPagePerBloc > 0)
    //  then number of bloc ++
      numBloc++;
    return { numPage : numPage, numPagePerBloc : numPagePerBloc, numBloc : numBloc};
  }



  /**
   * @description 페이지 번호 눌러서 해당 페이지의 글들 로드하는 함수
   */
  loadListByPageIdx(start_idx: number) : void {
    // let body = { cur_start_idx: start_idx };
    this.fullTextSearchComplete(searchOption.body, this.keyword, start_idx)
    // let res = await this.http.post<any>(this.URL_LOAD_LIST_BY_PAGE_IDX,body).toPromise();
    // return this.saveResponse(res);
  }





  

  //Elasticsearch Connection
  private _connect() {
    let es_url = this.ipSvc.getBackEndServerIp();
    this.client = new elasticsearch.Client({
      host: es_url,
      headers: {
        'Access-Control-Allow-Origin': this.ipSvc.get_FE_Ip()
      }
      // log: "trace"//to log the query and response in stdout
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: "hello! Sapphire!"
    });
  }
}
