import { Injectable } from "@angular/core";
import { Client } from "elasticsearch-browser";
import * as elasticsearch from "elasticsearch-browser";
//import { InheritDefinitionFeature } from '@angular/core/src/render3';
import { ArticleSource } from "src/app/modules/homes/body/shared-module/common-search-result-document-list/article/article.interface";
import { Subject, Observable } from "rxjs";
import { IpService } from 'src/app/ip.service'


@Injectable({
  providedIn: "root"
})
export class ElasticsearchService {
  private client: Client;
  articleSource = new Subject<ArticleSource[]>();
  // articleSource = new Observable<ArticleSource[]>();
  articleInfo$ = this.articleSource.asObservable();
  private searchKeyword: string = undefined;

  constructor(private ipSvc : IpService) {
    if (!this.client) {
      this._connect();
    }
  }

  /**
   * @function setKeyword
   * 키워드를 이 서비스에 저장한다. 저장한 이후에 검색 가능.
   * @param keyword
   * 저장할 키워드 string
   */
  setKeyword(keyword: string) {
    this.searchKeyword = keyword;
  }

  getKeyword() {
    return this.searchKeyword;
  }

  private queryalldocs = {
    query: {
      match_all: {}
    }
  };

  getAllDocument(_index, _type): any {
    return this.client.search({
      body: this.queryalldocs,
      filterPath: ["hits.hits._source"]
    });
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
    this.client
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
      .then(response => {
        //검색 후 observable에 저장
        // console.log(response)
        this.transfer_to_article_source(response.hits.hits);
      });
  }

  /**
   * @function fillSubscrb
   * 검색 결과를 observable에 저장하는 함수.
   * 저장을 해줘야 subscribe 함수를 통해서 subscriber들이 받아올 수 있다.
   * 비동기 함수로 유용하게 사용!
   * @param info
   * 저장할 article array
   *
   */
  transfer_to_article_source(info: ArticleSource[]) {
    this.articleSource.next(info);
    // console.log("saved : ", this.articleSource);
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

  search_to_article_source(hookFunc){
    hookFunc.then(response => {
      //검색 후 observable에 저장
      // console.log(response)
      this.transfer_to_article_source(response.hits.hits);
    });
  }

  

  //Elasticsearch Connection
  private _connect() {
    let es_url = this.ipSvc.getBackEndServerIp();
    this.client = new elasticsearch.Client({
      host: es_url,
      headers: {
        'Access-Control-Allow-Origin': "http://203.252.112.15:4200"
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
