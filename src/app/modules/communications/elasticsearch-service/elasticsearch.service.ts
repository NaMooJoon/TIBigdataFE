import { Injectable } from "@angular/core";
import { Client } from "elasticsearch-browser";
import * as elasticsearch from "elasticsearch-browser";
import { ArticleSource } from "src/app/modules/homes/body/shared-modules/documents/article.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { IpService } from 'src/app/ip.service'
import { ElasticSearchQueryModel } from "./elasticsearch.service.query.model";


export enum SEARCHMODE {
  ALL, IDS, KEYWORD,
  INST
};
export enum SORT { DATE_ASC, DATE_DESC, SCORE }

@Injectable({
  providedIn: "root"
})

export class ElasticsearchService {

  private client: Client;
  private articleSource: BehaviorSubject<ArticleSource[]> = new BehaviorSubject<ArticleSource[]>(undefined);
  private articleNum: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  private keyword: string = "";
  private selectedInst: string;
  private ids: string[] = [];
  private sortOption: SORT = SORT.SCORE;
  private numDocsPerPage: number = 10;
  private searchMode: SEARCHMODE;
  private searchStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentSearchingPage: number = 1;

  constructor(
    private ipSvc: IpService,
    private esQueryModel: ElasticSearchQueryModel) {
    if (!this.client) {
      this._connect();
    }
  }

  searchKeyword(keyword: string) {
    this.searchMode = SEARCHMODE.KEYWORD;
    this.setKeyword(keyword);
    this.triggerSearch(1);
  }

  getSearchMode() {
    return this.searchMode;
  }

  setSearchMode(searchMode: SEARCHMODE) {
    this.searchMode = searchMode;
  }

  getArticleNumChange(): Observable<number> {
    return this.articleNum.asObservable();
  }

  setArticleNumChange(num: number) {
    this.articleNum.next(num);
  }

  getArticleChange() {
    return this.articleSource;
  }

  setKeyword(keyword: string): void {
    this.esQueryModel.setSearchKeyword(keyword);
    this.keyword = keyword;
  }

  getKeyword(): string {
    return this.keyword;
  }

  setSearchStatus(isSearchDone: boolean): void {
    this.searchStatus.next(isSearchDone);
  }

  getSearchStatus(): Observable<boolean> {
    return this.searchStatus.asObservable();
  }

  setIds(ids: string[]): void {
    this.esQueryModel.setSearchIds(ids);
    this.ids = ids;
  }

  searchAllDocs(startIndex?: number, docSize?: number): any {
    if (!startIndex)
      startIndex = 0;
    if (!docSize)
      docSize = this.numDocsPerPage;

    return this.client.search({
      index: this.ipSvc.ES_INDEX,
      body: this.esQueryModel.getAllDocs(),
      from: startIndex,
      size: docSize,
      filterPath: this.esQueryModel.getFilterPath(),
      _source: this.esQueryModel.getSearchSource(),
    })
  }

  allSearchComplete(startIndex?: number): void {
    this.saveSearchResult(this.searchAllDocs(startIndex));
  }

  fullTextSearchComplete(startIndex?: number, docSize?: number): void {
    if (startIndex < 0) startIndex = 0;
    this.saveSearchResult(this.searchByText(startIndex, docSize));
  }

  searchByText(startIndex?: number, docSize?: number): Promise<any> {
    if (!startIndex)
      startIndex = 0;
    if (!docSize)
      docSize = this.numDocsPerPage;

    return this.client.search({
      from: startIndex,
      size: docSize,
      filterPath: this.esQueryModel.getFilterPath(),
      body: this.esQueryModel.getSearchDocs(),
      _source: this.esQueryModel.getSearchSource(),
    })
  }

  countAllDocs() {
    return this.client.count({
      index: this.ipSvc.ES_INDEX,
      body: this.esQueryModel.getAllDocs(),
    })
  }

  allCountComplete(): void {
    this.countAllDocs().then(articleNum => {
      this.articleNum.next(articleNum.count);
    });
  }

  countByText(): Promise<any> {
    return this.client.count({
      body: this.esQueryModel.getSearchDocCount(),
    });
  }

  countByTextComplete(): void {
    this.countByText().then(articleNum =>
      this.articleNum.next(articleNum.count)
    )
  }

  countByIds(): Promise<any> {
    return this.client.count({
      index: this.ipSvc.ES_INDEX,
      body: this.esQueryModel.getSearchIds(),
    });
  }

  countByIdsComplete(): void {
    this.countByIds().then(articleNum =>
      this.articleNum.next(articleNum.count)
    )
  }

  getArticleNumber(): Promise<number> {
    return this.countByText().then(res => {
      return res.count;
    },
      err => console.error(err)
    );
  }

  IdSearchComplete(id: string): void {
    this.saveSearchResult(this.searchById());
  }

  searchById(): Promise<any> {
    return this.client.search({
      filterPath: this.esQueryModel.getFilterPath(),
      body: this.esQueryModel.getSearchIds(),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  multiIdSearchComplete(startIndex?: number): void {
    this.saveSearchResult(this.searchByManyId(startIndex));
  }

  searchByManyId(startIndex?: number, docSize?: number): Promise<any> {
    return this.client.search({
      from: startIndex,
      size: docSize,
      body: this.esQueryModel.getSearchIds(),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  async saveSearchResult(queryFunc: any): Promise<void> {
    await queryFunc.then(response => {
      if (response.hits.total.value === 0) this.docsToArticleSource(null)
      else this.docsToArticleSource(response.hits.hits);
    });
  }

  docsToArticleSource(info: Array<ArticleSource>): void {
    this.articleSource.next(info);
  }

  getNumDocsPerPage(): number {
    return this.numDocsPerPage;
  }

  setNumDocsPerPage(num: number) {
    this.numDocsPerPage = num;
  }

  triggerSearch(selectedPageNum: number) {
    this.esQueryModel.setSortOption(this.sortOption);
    console.log(this.esQueryModel.getSearchDocs())
    let searchMode = this.getSearchMode()
    this.setCurrentSearchingPage(selectedPageNum);
    if (searchMode === SEARCHMODE.ALL) {
      this.allSearchComplete((selectedPageNum - 1) * this.getNumDocsPerPage());
      this.allCountComplete();
    }
    else if (searchMode === SEARCHMODE.IDS) {
      this.multiIdSearchComplete((selectedPageNum - 1) * this.getNumDocsPerPage());
      this.countByIdsComplete();
    }
    else if (searchMode === SEARCHMODE.KEYWORD) {
      this.fullTextSearchComplete((selectedPageNum - 1) * this.getNumDocsPerPage());
      this.countByTextComplete();
    }
    else if (searchMode === SEARCHMODE.INST) {
      this.searchByInstComplete((selectedPageNum - 1) * this.getNumDocsPerPage());
      this.countByInstComplete();
    }
  }

  setCurrentSearchingPage(pageNum: number) {
    this.currentSearchingPage = pageNum;
  }

  getCurrentSearchingPage() {
    return this.currentSearchingPage;
  }

  setSortOption(op: SORT) {
    this.sortOption = op;
  }

  getInstitutionsWithTextSearch() {
    return this.client.search({
      body: {
        "size": 0,
        "aggs": {
          "count": { "terms": { "field": "published_institution.keyword" } }
        },
        "query": {
          'multi_match': {
            'query': this.keyword,
            'fields': ["post_title", "file_extracted_content", "post_body"]
          }
        }
      }
    });
  }

  getInstitutions() {
    return this.client.search({
      body: {
        "size": 0,
        "aggs": {
          "count": { "terms": { "field": "published_institution.keyword" } }
        },
      }
    });
  }

  searchByInst(startIndex?: number): Promise<any> {
    return this.client.search({
      from: startIndex,
      size: this.numDocsPerPage,
      body: {
        "query": {
          "match": {
            "published_institution": this.selectedInst,
          }
        }
      },
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  searchByInstComplete(startIndex?: number) {
    this.saveSearchResult(this.searchByInst(startIndex));
  }

  countByInstComplete() {
    this.countByInst().then(articleNum => {
      this.articleNum.next(articleNum.count);
    });
  }

  countByInst() {
    return this.client.count({
      body: {
        "query": {
          "match": {
            "published_institution": this.selectedInst,
          }
        }
      },
    });
  }

  setArticleNum(num: number) {
    this.articleNum.next(num);
  }

  setSelectedInst(inst: string) {
    this.selectedInst = inst;
  }

  private _connect() {
    this.client = new elasticsearch.Client({
      host: [{
        host: this.ipSvc.getBackEndServerIp(),
        auth: this.ipSvc.getESAuth(),
        protocol: 'http',
        port: this.ipSvc.ES_PORT,
        index: this.ipSvc.ES_INDEX
      }],
      headers: {
        'Access-Control-Allow-Origin': this.ipSvc.getFrontEndServerIP() + this.ipSvc.getAngularPort()
      }
    });
  }

  isAvailable(): any {
    return this.client.ping({
      requestTimeout: Infinity,
      body: "ElasticSearch Works!"
    });
  }
}