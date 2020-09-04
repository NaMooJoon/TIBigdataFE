import { Injectable } from "@angular/core";
import { Client } from "elasticsearch-browser";
import * as elasticsearch from "elasticsearch-browser";
//import { InheritDefinitionFeature } from '@angular/core/src/render3';
import { ArticleSource } from "src/app/modules/homes/body/shared-module/common-search-result-document-list/article/article.interface";
import { Subject, Observable } from "rxjs";
import { IpService } from 'src/app/ip.service'


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
  articleSource = new Subject<ArticleSource[]>();
  articleInfo$ = this.articleSource.asObservable();
  private searchKeyword = new Subject<string>();

  constructor(private ipSvc : IpService) {
    if (!this.client) {
      this._connect();
    }
  }

  /**
   * @function setKeyword
   * 키워드를 이 서비스에 저장한다. 저장한 이후에 검색 가능.
   * 저장할 키워드 string
   */
  setKeyword(keyword: string) {
    this.searchKeyword.next(keyword);
  }

  getKeyword() {
    // console.log("es : getkey")
    return new Promise(resolve=>{
      this.searchKeyword.subscribe(res=>{
        resolve(res);
      })
    })
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
  allSearch(){
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
  fullTextSearch(_field, _queryText) {
    this. save_search_result_from_hook(this.searchByText(_field, _queryText));
  }


  /**
   * @function searchByText
   * @description search by keyword text matching
   */
  searchByText(_field, _queryText) {
    return this.client
      .search({
        from:0,
        size: 10,
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
  

  /**
   * @function IdSearch
   * @param id : string
   * @description ES에서 검색하고자 하는 문서의 id을 검색해서 article source에 저장까지 완료
   */
  IdSearch(id : string){
    this.save_search_result_from_hook(this.searchById(id));
  }

  /**
   * @function searchById
   * id을 기준으로 db에서 검색한 결과를 바로 반환해준다.
   * 
   * @param id : 검색할 id string
   */
  searchById(id: string) {

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
  MultIdSearch(ids : string[]){
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
      from:0,//not work. github KUBiC issue # 34
      size: 10,//not work.
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

  save_search_result_from_hook(hookFunc){
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
  transfer_docs_to_article_source(info: ArticleSource[]) {
    this.articleSource.next(info);
    // console.log("saved : ", this.articleSource);
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
