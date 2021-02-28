import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { SearchMode } from "src/app/core/enums/search-mode";
import { AnalysisDatabaseService } from "src/app/core/services/analysis-database-service/analysis.database.service";
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.less"],
})
export class SearchBarComponent implements OnInit {
  private _searchKeyword: string = "";
  private _selectedDate: string;
  private _isDateSelected: boolean = false;
  private _isInstSelected: boolean = false;
  private _isTopicSelected: boolean = false;
  private _selectedInst: string;
  private _selectedTopic: string;
  private _isMain: boolean = false;
  private _isSearching: boolean = false;
  private _isKeyLoaded: boolean;
  public relatedKeywords = [];
  private searchStatusChange$: Observable<boolean> = this.elasticsearchService.getSearchStatus();

  private _dateList: Array<String> = [
    "전체",
    "1일",
    "1주일",
    "1개월",
    "3개월",
    "6개월",
    "1년",
  ];

  private _topicList: Array<String> = [
    "전체",
    "경제",
    "국제",
    "문화",
    "스포츠",
    "정치",
    "지역",
  ];


  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        color: "white",
        "background-color": "#0FBAFF",
        border: "none",
      };
    } else {
      return {
        color: "black",
        "background-color": "white",
      };
    }
  }

  constructor(
    public _router: Router,
    private elasticsearchService: ElasticsearchService,
    private articleService: ArticleService,
    private analysisDatabaseService: AnalysisDatabaseService
  ) {
    this.searchStatusChange$.subscribe((status) => {
      if (status === true) this.setRelatedKeywords();
    });

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this._router.url.includes("result")) {
          this.isKeyLoaded = false;
        }
      }
    });
  }

  ngOnInit() {
    this.selectedDate = "기간";
    this.selectedInst = "기관";
    this.selectedTopic = "주제별";
    this.isDateSelected = false;
    this.isInstSelected = false;
    this.isTopicSelected = false;
    this.isKeyLoaded = false;
    this.checkRouterIsMain();
  }

  /**
   * @description Update filter value.
   * @param date User selected value from filter.
   */
  updateDate(date: string): void {
    this.selectedDate = date;
    this.isDateSelected = true;
  }

  /**
   * @description Update filter value.
   * @param date User selected value from filter.
   */
  updateInst(inst: string): void {
    this.selectedInst = inst;
    this.isInstSelected = true;
  }

  /**
   * @description Update filter value.
   * @param date User selected value from filter.
   */
  updateTopic(topic: string): void {
    this.selectedTopic = topic;
    this.isTopicSelected = true;
  }

  /**
   * @description Update filter value.
   * @param date User selected value from filter.
   */
  updateKeyword($event: { target: { value: string } }): void {
    this.searchKeyword = $event.target.value;
  }

  /**
   * @description Reset filter selection by reloading component.
   */
  resetFilters(): void {
    this.ngOnInit();
  }

  /**
   * @description set search configuration and navigate to search result page. 
   */
  async search(): Promise<void> {
    this.elasticsearchService.setSearchMode(SearchMode.KEYWORD);
    this.elasticsearchService.setSearchStatus(false);
    this.elasticsearchService.searchKeyword(this.searchKeyword);
    this.elasticsearchService.setCurrentSearchingPage(1);
    this._router.navigateByUrl("/search/result");
  }

  gotoMain(): void {
    this._router.navigateByUrl("");
  }

  /**
   * @description Check if current url is home 
   */
  checkRouterIsMain(): void {
    if (this._router.routerState.snapshot.url === "/") {
      this.isMain = true;
    } else {
      this.isMain = false;
    }
  }

  /**
   * @description Check if current url is search/result
   */
  checkSearchRoute(): void {
    if (this._router.routerState.snapshot.url === "search/result") {
      this.isKeyLoaded = true;
    } else {
      this.isKeyLoaded = false;
    }
  }

  /**
   * @description Trigger search with given keyword. 
   * @param keyword Search keyword selected by user.
   */
  relatedSearch(keyword: string) {
    this.elasticsearchService.searchKeyword(keyword);
  }

  /**
   * @description Set related keywords for current search keyword.
   */
  async setRelatedKeywords(): Promise<void> {
    if (this._router.url.split("/")[2] !== "result") return;
    this.isKeyLoaded = false;
    this.relatedKeywords = [];
    await this.analysisDatabaseService
      .getTfidfVal(this.articleService.getList())
      .then((res) => {
        let data = res as [];
        for (let n = 0; n < data.length; n++) {
          let tfVal = data[n]["tfidf"];
          if (
            this.relatedKeywords.length < 6 &&
            tfVal[0] !== this.searchKeyword &&
            !this.relatedKeywords.includes(tfVal[0])
          )
            this.relatedKeywords.push(tfVal[0]);
        }
      });
    this.isKeyLoaded = true;
  }


  // getters and setters
  public get isDateSelected(): boolean {
    return this._isDateSelected;
  }
  public set isDateSelected(value: boolean) {
    this._isDateSelected = value;
  }
  public get isInstSelected(): boolean {
    return this._isInstSelected;
  }
  public set isInstSelected(value: boolean) {
    this._isInstSelected = value;
  }
  public get isTopicSelected(): boolean {
    return this._isTopicSelected;
  }
  public set isTopicSelected(value: boolean) {
    this._isTopicSelected = value;
  }
  public get selectedInst(): string {
    return this._selectedInst;
  }
  public set selectedInst(value: string) {
    this._selectedInst = value;
  }
  public get selectedTopic(): string {
    return this._selectedTopic;
  }
  public set selectedTopic(value: string) {
    this._selectedTopic = value;
  }
  public get isMain(): boolean {
    return this._isMain;
  }
  public set isMain(value: boolean) {
    this._isMain = value;
  }
  public get isSearching(): boolean {
    return this._isSearching;
  }
  public set isSearching(value: boolean) {
    this._isSearching = value;
  }
  public get isKeyLoaded(): boolean {
    return this._isKeyLoaded;
  }
  public set isKeyLoaded(value: boolean) {
    this._isKeyLoaded = value;
  }
  public get dateList(): Array<String> {
    return this._dateList;
  }
  public set dateList(value: Array<String>) {
    this._dateList = value;
  }
  public get selectedDate(): string {
    return this._selectedDate;
  }
  public set selectedDate(value: string) {
    this._selectedDate = value;
  }
  public get searchKeyword(): string {
    return this._searchKeyword;
  }
  public set searchKeyword(value: string) {
    this._searchKeyword = value;
  }
  public get topicList(): Array<String> {
    return this._topicList;
  }
  public set topicList(value: Array<String>) {
    this._topicList = value;
  }
}
