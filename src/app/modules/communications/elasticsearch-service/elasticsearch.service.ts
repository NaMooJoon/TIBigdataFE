import { Injectable } from "@angular/core";
import { Client } from "elasticsearch-browser";
import * as elasticsearch from "elasticsearch-browser";
//import { InheritDefinitionFeature } from '@angular/core/src/render3';
import { ArticleSource } from "src/app/modules/homes/body/shared-module/common-search-result-document-list/article/article.interface";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { IpService } from 'src/app/ip.service'
import { query } from '@angular/animations';
import { IdControlService } from "src/app/modules/homes/body/search/service/id-control-service/id-control.service";


class searchOption {
  static readonly title = "post_title";
  static readonly date = "post_date";
  static readonly inst = "published_institution_url";
  static readonly author = "post_writer";
  static readonly body = "post_body";
}


export enum SEARCHMODE {
  INIT,//굳이 INIT이 있는 이유 ; 디버깅 편하게 하려고. 아무것도 없이 search result doc list page에 오면 디버깅으로 인식해서 초기값 검색
  ALL,
  ID,
  KEY
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
  private articleSource: BehaviorSubject<ArticleSource[]> = new BehaviorSubject<ArticleSource[]>(undefined);
  private countNum: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  readonly DEFUALT_KEYWROD: string = "";
  private keyword: string = this.DEFUALT_KEYWROD;
  private DOC_NUM_PER_EACH_PAGE: number = 10;

  currentSearchMode: SEARCHMODE = SEARCHMODE.INIT;

  constructor(private ipSvc: IpService, private idCtrSvc: IdControlService) {
    if (!this.client) {
      this._connect();
    }
  }
  readonly DEBUG: boolean = true;


  debug(...arg: any[]) {
    if (this.DEBUG)
      console.log(arg);
  }

  setSearchMode(mode: SEARCHMODE) {
    this.currentSearchMode = mode;
  }

  getCurrSearchMode(): SEARCHMODE {
    return this.currentSearchMode;
  }

  searchKeyword(keyword: string) {
    this.keyword = keyword;
    this.fullTextSearchComplete("post_body", keyword);
    this.countByTextComplete("post_body", keyword);
  }


  getCountNumChange(): Observable<number> {
    return this.countNum.asObservable();
  }

  setCountNumChange(num: number) {
    this.countNum.next(num);
  }

  getArticleChange() {
    return this.articleSource;
  }

  /**
   * @function setKeyword
   * 키워드를 이 서비스에 저장한다. 저장한 이후에 검색 가능.
   * 저장할 키워드 string
   */
  setKeyword(keyword: string): void {
    if (keyword != this.keyword) {
      this.keyword = keyword;

    }
  }

  getKeyword(): string {
    return this.keyword;
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
  searchAllDocs(startIndex?: number, docSize?: number): any {
    this.debug("search all docs init")

    if (!startIndex)
      startIndex = 0;
    if (!docSize)
      docSize = this.DOC_NUM_PER_EACH_PAGE;

    return this.client.search({
      body: this.queryalldocs,
      from: startIndex,
      size: docSize,
      filterPath: [
        "hits.hits._source",
        "hits.hits._id",
        "hits.total",
        "_scroll_id"
      ],

      _source: [
        "post_title",
        "post_date",
        "published_institution_url",
        "published_institution",
        "post_writer",
        "post_body",
        "file_download_url",
      ]
    })
  }


  /**
   * @function allSearch 
   * @description 모든 문서를 검색하는 함수를 실행한 뒤 article source까지 저장
   */
  allSearchComplete(startIndex?: number): void {
    this.saveSearchResult(this.searchAllDocs(startIndex));
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
  fullTextSearchComplete(_field: string, _queryText: string, startIndex?: number, docSize?: number): void {
    if (!_field)
      _field = searchOption.body;
    if (!_queryText)
      _queryText = this.keyword;
    this.saveSearchResult(this.searchByText(_field, _queryText, startIndex, docSize));
  }

  /**
   * @function searchByText
   * @description search by keyword text matching
   */
  searchByText(_field: string, _queryText: string, startIndex?: number, docSize?: number): Promise<any> {
    if (!startIndex)
      startIndex = 0;
    if (!docSize)
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
            multi_match: {
              query: _queryText,
              fields: ["file_extracted_content", "post_body"]
            }
          }
        },
        _source: [
          "post_title",
          "post_date",
          "published_institution_url",
          "published_institution",
          "post_writer",
          "post_body",
          "file_download_url",
        ]
      })
  }


  countAllDocs() {
    return this.client.count({
      body: this.queryalldocs,
      // filterPath: ["hits.hits._source"]
    })
  }

  /**
 * @function allCountComplete 
 * @description 모든 문서 수 검색하는 함수를 실행한 뒤 article source까지 저장
 */
  allCountComplete(): void {
    this.countAllDocs().then(countNum => {
      this.debug("all count complete : num", countNum);
      this.countNum.next(countNum.count);
    }
    )
  }


  countByText(_field: string, _queryText: string): Promise<any> {
    if (!_field)
      _field = searchOption.body;
    if (!_queryText)
      _queryText = this.keyword;
    return this.client.count({
      body: {
        query: {
          multi_match: {
            query: _queryText,
            fields: ["file_extracted_content", "post_body"]
          }
        }
      },
    })
  }

  countByTextComplete(field: string, queryText: string): void {
    this.countByText(field, queryText).then(countNum =>
      this.countNum.next(countNum.count)
    )
  }

  getCountNumber(field: string, queryText: string): Promise<number> {
    return this.countByText(field, queryText).then(
      res => {
        return res.count;
      },
      err => console.error(err)
    )
  }


  /**
   * @function IdSearch
   * @param id : string
   * @description ES에서 검색하고자 하는 문서의 id을 검색해서 article source에 저장까지 완료
   */
  IdSearchComplete(id: string): void {
    this.saveSearchResult(this.searchById(id));
  }

  /**
   * @function searchById
   * id을 기준으로 db에서 검색한 결과를 바로 반환해준다.
   * 
   * @param id : 검색할 id string
   */
  searchById(id: string): Promise<any> {

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
        "published_institution",
        "post_writer",
        "post_body",
        "file_download_url",
      ]
    });
  }


  /**
   * @function MultIdSearch
   * @param id : string array
   * @description ES에서 검색하고자 하는 문서의 id array을 검색해서 article source에 저장까지 완료
   */
  multIdSearchComplete(ids: string[]): void {
    this.saveSearchResult(this.searchByManyId(ids));
  }

  /**
   * @function searchByManyId
   * id을 기준으로 db에서 검색한 결과를 바로 반환해준다.
   * 
   * @param id : 검색할 id string
   */
  searchByManyId(ids: string[], startIndex?: number, docSize?: number): Promise<any> {
    // console.log("es ts: the num of ids : "+ids.length);
    return this.client.search({
      from: startIndex,
      size: docSize,
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
        "published_institution",
        "post_writer",
        "post_body",
        "file_download_url"
      ]
    });
  }

  saveSearchResult(queryFunc: any): void {
    queryFunc.then(response => {
      this.docs2artclSrc(response.hits.hits);
    });
  }

  /**
 * @function docs2artclSrc
 * @description save new article source and call observable event 
 * @param info array of documents that is collected by ES query result.
 */
  docs2artclSrc(info: ArticleSource[]): void {
    this.articleSource.next(info);
  }

  getDefaultNumDocsPerPage(): number {
    return this.DOC_NUM_PER_EACH_PAGE;
  }

  setNumDocsPerPage(num: number) {
    this.DOC_NUM_PER_EACH_PAGE = num;
  }

  // TODO: Pagination algorithm is not efficient. we do not need to caculate numBloc. There will be more efficient and clear alorithm for pagination. Try other approaches later on.
  async setPagination(): Promise<any> {
    return new Promise(resolve => {
      this.countNum.subscribe(totalDocs => {
        /* Get total page number */
        let totalPageNum = Math.floor(totalDocs / this.DOC_NUM_PER_EACH_PAGE);
        if (totalDocs % this.DOC_NUM_PER_EACH_PAGE > 0) {
          totalPageNum++;
        }

        let numPagePerBloc = this.DOC_NUM_PER_EACH_PAGE;
        //number of bloc ← number of pages / M
        let numBloc = Math.floor(totalPageNum / numPagePerBloc);
        //if number of pages % M > 0:
        if (totalPageNum % numPagePerBloc > 0)
          //  then number of bloc ++
          numBloc++;
        resolve({ numPage: totalPageNum, numPagePerBloc: numPagePerBloc, numBloc: numBloc });
      })
    })
  }

  nextSearch(startIndex: number) {
    // TODO: return for what? 'fullTextSearchComplete' does not have return value.
    return this.fullTextSearchComplete(searchOption.body, this.keyword, startIndex)
  }

  /**
   * @description 페이지 번호 눌러서 해당 페이지의 글들 로드하는 함수
   */
  loadListByPageIdx(startIndex: number, docSize?: number): void {
    // let body = { cur_start_idx: startIndex };
    if (this.currentSearchMode == SEARCHMODE.ALL) {
      this.allSearchComplete(startIndex);
      this.debug("load list by page index : isAllSearch", this.currentSearchMode)
    }
    // else if(isAllSearch == undefined)
    else if (this.currentSearchMode == SEARCHMODE.KEY)
      this.fullTextSearchComplete(searchOption.body, this.keyword, startIndex)
    else if (this.currentSearchMode == SEARCHMODE.ID) {
      let partialIDs = this.idCtrSvc.getIDList().slice(startIndex, this.getDefaultNumDocsPerPage());
    }
    else
      console.error("elasticsearch.service.ts : loadListByPageIdx parameter error.")
  }

  //Elasticsearch Connection
  private _connect() {
    this.client = new elasticsearch.Client({
      host: [{
        host: this.ipSvc.getBackEndServerIp(),
        auth: this.ipSvc.getESAuth(),
        protocol: 'http',
        port: this.ipSvc.ES_PORT
      }],
      headers: {
        'Access-Control-Allow-Origin': this.ipSvc.getFrontEndServerIP() + this.ipSvc.getAngularPort()
      }
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: "hello! Sapphire!"
    });
  }
}
