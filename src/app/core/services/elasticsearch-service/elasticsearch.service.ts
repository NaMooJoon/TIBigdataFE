import { Injectable } from "@angular/core";
import * as elasticsearch from "elasticsearch-browser";
import { Client } from "elasticsearch-browser";
import { BehaviorSubject, Observable } from "rxjs";
import { SearchMode } from "src/app/core/enums/search-mode";
import { SortOption } from "src/app/core/enums/serch-result-sort-option";
import { ArticleSource } from "src/app/core/models/article.model";
import { IpService } from "src/app/core/services/ip-service/ip.service";
import { ElasticSearchQueryModel } from "../../models/elasticsearch.service.query.model";

@Injectable({
  providedIn: "root",
})

/**
 * ElasticsearchService takes control of seding and getting query to ElasticSearch server. All articles used in our web-service are get by this service.
 */
export class ElasticsearchService {
  private client: Client;
  private articleSource: BehaviorSubject<ArticleSource[]> = new BehaviorSubject<ArticleSource[]>(undefined);
  private articleNum: BehaviorSubject<number> = new BehaviorSubject<any>(0);
  private keyword: string = "";
  private selectedInst: string;
  private ids: string[] = [];
  private sortOption: SortOption = SortOption.SCORE;
  private numDocsPerPage: number = 10;
  private searchMode: SearchMode;
  private searchStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private currentSearchingPage: number = 1;

  constructor(
    private ipSvc: IpService,
    private esQueryModel: ElasticSearchQueryModel
  ) {
    if (!this.client) {
      this._connect();
    }
  }

  /**
   * @description Search articles with keyword. Set search mode and search keyword, then run searching logic.
   * @param keyword 
   */
  searchKeyword(keyword: string): void {
    this.searchMode = SearchMode.KEYWORD;
    this.setKeyword(keyword);
    this.triggerSearch(1);
  }

  /**
   * @description Get current search mode.
   * @returns Current search mode.
   */
  getSearchMode(): SearchMode {
    return this.searchMode;
  }

  /**
   * @description Update current search mode.
   * @param searchMode 
   */
  setSearchMode(searchMode: SearchMode): void {
    this.searchMode = searchMode;
  }

  /**
   * @description Get observable of articleNum.
   * @returns Observalbe of articleNum.
   */
  getArticleNumChange(): Observable<number> {
    return this.articleNum.asObservable();
  }

  /**
   * @description Update article numbers and send the data to all subscribers.
   * @param num 
   */
  setArticleNumChange(num: number): void {
    this.articleNum.next(num);
  }

  /**
   * @description Get article source as BehaviorSubject for subscription.
   * @returns Current article source
   */
  getArticleChange(): BehaviorSubject<ArticleSource[]> {
    return this.articleSource;
  }

  /**
   * @description Update search keyword
   * @param keyword 
   */
  setKeyword(keyword: string): void {
    this.esQueryModel.setSearchKeyword(keyword);
    this.keyword = keyword;
  }

  /**
   * @description Return current search keyword
   * @returns Value of current search keyword
   */
  getKeyword(): string {
    return this.keyword;
  }

  /**
   * @description Update status of searching and send the data to all subscribers.
   * @param isSearchDone the status of searching
   */
  setSearchStatus(isSearchDone: boolean): void {
    this.searchStatus.next(isSearchDone);
  }

  /**
   * @description Get status of searching as obervable.
   * @returns observable of isSearchDone
   */
  getSearchStatus(): Observable<boolean> {
    return this.searchStatus.asObservable();
  }

  /**
   * @description Update article ids to search
   * @param ids 
   */
  setIds(ids: string[]): void {
    this.esQueryModel.setSearchIds(ids);
    this.ids = ids;
  }

  /**
   * @description Send query to get information of all articles exist in backend database.
   * @param startIndex A index to indicate where to start search.
   * @param docSize Number of articles to search at one time.
   */
  searchAllDocs(startIndex?: number, docSize?: number): any {
    if (!startIndex) startIndex = 0;
    if (!docSize) docSize = this.numDocsPerPage;

    return this.client.search({
      index: this.ipSvc.ES_INDEX,
      body: this.esQueryModel.getAllDocs(),
      from: startIndex,
      size: docSize,
      filterPath: this.esQueryModel.getFilterPath(),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  /**
   * @description Save search result after searching. This function works as a wrapper to call function of sending query and save the responded data into article source. 
   * @param startIndex A index to indicate where to start search.
   */
  allSearchComplete(startIndex?: number): void {
    this.saveSearchResult(this.searchAllDocs(startIndex));
  }

  /**
   * @description Save search result after searching. This function works as a wrapper to call function of sending query and save the responded data into article source. 
   * @param startIndex A index to indicate where to start search.
   * @param docSize Number of articles to search at one time.
   */
  fullTextSearchComplete(startIndex?: number, docSize?: number): void {
    if (startIndex < 0) startIndex = 0;
    this.saveSearchResult(this.searchByText(startIndex, docSize));
  }

  /**
   * @description Send query to get information of articles that match with saved search keyword.
   * @param startIndex A index to indicate where to start search.
   * @param docSize Number of articles to search at one time.
   */
  searchByText(startIndex?: number, docSize?: number): Promise<any> {
    if (!startIndex) startIndex = 0;
    if (!docSize) docSize = this.numDocsPerPage;

    return this.client.search({
      from: startIndex,
      size: docSize,
      filterPath: this.esQueryModel.getFilterPath(),
      body: this.esQueryModel.getSearchDocs(),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  /**
   * @description Get number of articles in backend database.
   * @returns Response of query.
   */
  async countAllDocs(): Promise<any> {
    return await this.client.count({
      index: this.ipSvc.ES_INDEX,
      body: this.esQueryModel.getAllDocs(),
    });
  }

  /**
   * @description Update number of articles for all subscribers.
   */
  allCountComplete(): void {
    this.countAllDocs().then((articleNum) => {
      this.articleNum.next(articleNum.count);
    });
  }

  /**
   * @description Update number of articles that mathces with search keyword.
   * @returns query result
   */
  countByText(): Promise<any> {
    return this.client.count({
      body: this.esQueryModel.getSearchDocCount(),
    });
  }

  /**
   * @description Update number of articles for all subscribers.
   */
  countByTextComplete(): void {
    this.countByText().then((articleNum) =>
      this.articleNum.next(articleNum.count)
    );
  }

  /**
   * @description Update number of articles that mathces with list of ids.
   * @returns query result
   */
  countByIds(): Promise<any> {
    return this.client.count({
      index: this.ipSvc.ES_INDEX,
      body: this.esQueryModel.getSearchIds(),
    });
  }

  /**
   * @description Update number of articles for all subscribers.
   */
  countByIdsComplete(): void {
    this.countByIds().then((articleNum) =>
      this.articleNum.next(articleNum.count)
    );
  }

  /**
   * @description Send query to ElasticSearch with article ids
   */
  searchById(): Promise<any> {
    return this.client.search({
      filterPath: this.esQueryModel.getFilterPath(),
      body: this.esQueryModel.getSearchIds(),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  /**
   * @description Save search result after searching. This function works as a wrapper to call function of sending query and save the responded data into article source. 
   * @param startIndex 
   */
  multiIdSearchComplete(startIndex?: number): void {
    this.saveSearchResult(this.searchByManyId(startIndex));
  }

  /**
   * @description Send query to ElasticSearch with article ids
   * @param startIndex A index to indicate where to start search.
   * @param docSize Number of articles to search at one time.
   */
  searchByManyId(startIndex?: number, docSize?: number): Promise<any> {
    return this.client.search({
      from: startIndex,
      size: docSize,
      body: this.esQueryModel.getSearchIds(),
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  /**
   * @description Based on query logiv passed to this function, this function reads the result of the query and save the article data into articleSource data. 
   * @param queryFunc Function that holds query for ElasticSearch.
   */
  async saveSearchResult(queryFunc: any): Promise<void> {
    await queryFunc.then((response) => {
      if (response.hits.total.value === 0) this.docsToArticleSource(null);
      else this.docsToArticleSource(response.hits.hits);
    });
  }

  /**
   * @description Update articleSource and send data to all subscribers.
   * @param info New article source to update.
   */
  docsToArticleSource(info: Array<ArticleSource>): void {
    this.articleSource.next(info);
  }

  /**
   * @description Get number of article displays on one page
   * @returns Value of numDocPerPage.
   */
  getNumDocsPerPage(): number {
    return this.numDocsPerPage;
  }

  /**
   * @description Update number of article displays on one page.
   * @param num Number of documents to display on page.
   */
  setNumDocsPerPage(num: number) {
    this.numDocsPerPage = num;
  }

  /**
   * @description Start searching process depends on the search mode.
   * @param selectedPageNum A page to display.
   */
  triggerSearch(selectedPageNum: number): void {
    this.esQueryModel.setSortOption(this.sortOption);
    let searchMode = this.getSearchMode();
    this.setCurrentSearchingPage(selectedPageNum);
    if (searchMode === SearchMode.ALL) {
      this.allSearchComplete((selectedPageNum - 1) * this.getNumDocsPerPage());
      this.allCountComplete();
    } else if (searchMode === SearchMode.IDS) {
      this.multiIdSearchComplete(
        (selectedPageNum - 1) * this.getNumDocsPerPage()
      );
      this.countByIdsComplete();
    } else if (searchMode === SearchMode.KEYWORD) {
      this.fullTextSearchComplete(
        (selectedPageNum - 1) * this.getNumDocsPerPage()
      );
      this.countByTextComplete();
    } else if (searchMode === SearchMode.INST) {
      this.searchByInstComplete(
        (selectedPageNum - 1) * this.getNumDocsPerPage()
      );
      this.countByInstComplete();
    }
  }

  /**
   * @description Update current search page number
   * @param pageNum 
   */
  setCurrentSearchingPage(pageNum: number): void {
    this.currentSearchingPage = pageNum;
  }

  /**
   * @description get current search page number 
   * @returns value of currentSearchingPage
   */
  getCurrentSearchingPage(): number {
    return this.currentSearchingPage;
  }

  /**
   * @description Update current sort option.
   * @param op sort option to update 
   */
  setSortOption(op: SortOption): void {
    this.sortOption = op;
  }

  /**
   * TODO: move this query structure into EsQueryModel
   * @description Send query of keyword search that use published_institution field as a filter.
   * @returns query response
   */
  async getInstitutionsWithTextSearch(): Promise<any> {
    return await this.client.search({
      body: {
        size: 0,
        aggs: {
          count: { terms: { field: "published_institution.keyword" } },
        },
        query: {
          multi_match: {
            query: this.keyword,
            fields: ["post_title", "file_extracted_content", "post_body"],
          },
        },
      },
    });
  }

  /**
   * @description Send query of getting all published_institution field value and number of articles for each of the value.
   * @returns query response
   */
  async getInstitutions(): Promise<any> {
    return await this.client.search({
      body: {
        size: 0,
        aggs: {
          count: { terms: { field: "published_institution.keyword" } },
        },
      },
    });
  }

  /**
   * @description Send query of getting articles that are published from selected institution.
   * @param startIndex A index to indicate where to start search.
   */
  searchByInst(startIndex?: number): Promise<any> {
    return this.client.search({
      from: startIndex,
      size: this.numDocsPerPage,
      body: {
        query: {
          match: {
            published_institution: this.selectedInst,
          },
        },
      },
      _source: this.esQueryModel.getSearchSource(),
    });
  }

  /**
   * @description Save search result after searching. This function works as a wrapper to call function of sending query and save the responded data into article source. 
   * @param startIndex 
   */
  searchByInstComplete(startIndex?: number) {
    this.saveSearchResult(this.searchByInst(startIndex));
  }

  /**
   * @description Update number of articles for all subscribers.
   */
  countByInstComplete(): void {
    this.countByInst().then((articleNum) => {
      this.articleNum.next(articleNum.count);
    });
  }

  /**
   * @description Send query of getting number of documents published by selected institution.
   * @returns query response
   */
  async countByInst(): Promise<any> {
    return await this.client.count({
      body: {
        query: {
          match: {
            published_institution: this.selectedInst,
          },
        },
      },
    });
  }

  /**
   * @description Update number of articles for subscribers
   * @param num 
   */
  setArticleNum(num: number) {
    this.articleNum.next(num);
  }

  /**
   * @description Update selected institution.
   * @param inst 
   */
  setSelectedInst(inst: string) {
    this.selectedInst = inst;
  }

  /**
   * @description create connection of client and Elasticsearch in backend server.
   */
  private _connect() {
    this.client = new elasticsearch.Client({
      host: [
        {
          host: this.ipSvc.getBackEndServerIp(),
          auth: this.ipSvc.getESAuth(),
          protocol: "http",
          port: this.ipSvc.ES_PORT,
          index: this.ipSvc.ES_INDEX,
        },
      ],
      headers: {
        "Access-Control-Allow-Origin":
          this.ipSvc.getFrontEndServerIP() + this.ipSvc.getAngularPort(),
      },
    });
  }

  /**
   * @description: Send ping to Elasticsearch server to check the server is alive
   * @returns If the ping success, return the result, it the ping is failed return false.
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await this.client.ping({
        requestTimeout: 3000,
        body: "ElasticSearch Works!",
      });
    } catch (error) {
      return false;
    }
  }
}
