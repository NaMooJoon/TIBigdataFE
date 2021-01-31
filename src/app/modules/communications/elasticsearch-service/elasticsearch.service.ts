import { Injectable } from "@angular/core";
import { Client } from "elasticsearch-browser";
import * as elasticsearch from "elasticsearch-browser";
import { ArticleSource } from "src/app/modules/homes/body/shared-modules/documents/article/article.interface";
import { Observable, BehaviorSubject } from "rxjs";
import { IpService } from 'src/app/ip.service'
import { IdControlService } from "src/app/modules/homes/body/shared-services/id-control-service/id-control.service";
import { ElasticSearchQueryModel } from "./elasticsearch.service.query.model";
import { start } from "repl";

export enum SEARCHMODE { INIT, ALL, ID, KEY }

@Injectable({
  providedIn: "root"
})
export class ElasticsearchService {
  private client: Client;
  private articleSource: BehaviorSubject<ArticleSource[]> = new BehaviorSubject<ArticleSource[]>(undefined);
  private countNum: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  private keyword: string = "";
  private numDocsPerPage: number = 10;
  currentSearchMode: SEARCHMODE = SEARCHMODE.INIT;

  constructor(
    private ipSvc: IpService,
    private esQueryModel: ElasticSearchQueryModel) {
    if (!this.client) {
      this._connect();
    }
  }

  setSearchMode(mode: SEARCHMODE) {
    this.currentSearchMode = mode;
  }

  getCurrSearchMode(): SEARCHMODE {
    return this.currentSearchMode;
  }

  searchKeyword(keyword: string) {
    this.setKeyword(keyword);
    this.setSearchMode(SEARCHMODE.KEY)
    this.fullTextSearchComplete();
    this.countByTextComplete();
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

  setKeyword(keyword: string): void {
    this.esQueryModel.setSearchKeyword(keyword);
    this.keyword = keyword;
  }

  getKeyword(): string {
    return this.keyword;
  }

  searchAllDocs(startIndex?: number, docSize?: number): any {
    if (!startIndex)
      startIndex = 0;
    if (!docSize)
      docSize = this.numDocsPerPage;

    return this.client.search({
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
    this.saveSearchResult(this.searchByText(startIndex, docSize));
  }

  searchByText(startIndex?: number, docSize?: number): Promise<any> {
    if (!startIndex)
      startIndex = 0;
    if (!docSize)
      docSize = this.numDocsPerPage;

    console.log('startindex: ', startIndex);
    return this.client
      .search({
        from: startIndex,
        size: docSize,
        filterPath: this.esQueryModel.getFilterPath(),
        body: this.esQueryModel.getSearchDocs(),
        _source: this.esQueryModel.getSearchSource(),
      })
  }

  countAllDocs() {
    return this.client.count({
      body: this.esQueryModel.getAllDocs(),
    })
  }

  allCountComplete(): void {
    this.countAllDocs().then(countNum => {
      this.countNum.next(countNum.count);
    });
  }

  countByText(): Promise<any> {
    return this.client.count({
      body: this.esQueryModel.getSearchDocs(),
    });
  }

  countByTextComplete(): void {
    this.countByText().then(countNum =>
      this.countNum.next(countNum.count)
    )
  }

  countByIds(ids: string | string[]): Promise<any> {
    return this.client.count({
      body: this.esQueryModel.getSearchIds(ids),
    });
  }

  countByIdsComplete(ids: string | string[]): void {
    this.countByIds(ids).then(countNum =>
      this.countNum.next(countNum.count)
    )
  }

  getCountNumber(): Promise<number> {
    return this.countByText().then(res => {
      return res.count;
    },
      err => console.error(err)
    );
  }

  IdSearchComplete(id: string): void {
    this.saveSearchResult(this.searchById(id));
  }

  searchById(id: string): Promise<any> {
    return this.client.search({
      filterPath: this.esQueryModel.getFilterPath(),
      body: this.esQueryModel.getSearchIds(id),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  multiIdSearchComplete(ids: string[], startIndex?: number): void {
    this.saveSearchResult(this.searchByManyId(ids, startIndex));
  }

  searchByManyId(ids: string[], startIndex?: number, docSize?: number): Promise<any> {
    return this.client.search({
      from: startIndex,
      size: docSize,
      body: this.esQueryModel.getSearchIds(ids),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  saveSearchResult(queryFunc: any): void {
    queryFunc.then(response => {
      this.docs2artclSrc(response.hits.hits);
    });
  }

  docs2artclSrc(info: ArticleSource[]): void {
    this.articleSource.next(info);
  }

  getNumDocsPerPage(): number {
    return this.numDocsPerPage;
  }

  setNumDocsPerPage(num: number) {
    this.numDocsPerPage = num;
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