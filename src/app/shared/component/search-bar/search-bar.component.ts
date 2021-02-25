import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Observable, Subscriber } from "rxjs";
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
  private searchKeyword: string = "";
  private selectedDate: string;
  private dateList: Array<String> = [
    "전체",
    "1일",
    "1주일",
    "1개월",
    "3개월",
    "6개월",
    "1년",
  ];
  private topicList: Array<String> = [
    "전체",
    "경제",
    "국제",
    "문화",
    "스포츠",
    "정치",
    "지역",
  ];
  private isDateSelected: boolean = false;
  private isInstSelected: boolean = false;
  private isTopicSelected: boolean = false;
  private selectedInst: string;
  private selectedTopic: string;
  private isMain: Boolean = false;
  private isSearching: boolean = false;
  public relatedKeywords = [];
  private searchStatusChange$: Observable<boolean> = this.elasticsearchService.getSearchStatus();
  isKeyLoaded: boolean;

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

  updateDate(date: string) {
    this.selectedDate = date;
    this.isDateSelected = true;
  }

  updateInst(inst: string) {
    this.selectedInst = inst;
    this.isInstSelected = true;
  }

  updateTopic(topic: string) {
    this.selectedTopic = topic;
    this.isTopicSelected = true;
  }

  updateKeyword($event: { target: { value: string } }) {
    this.searchKeyword = $event.target.value;
  }

  resetFilters() {
    this.ngOnInit();
  }

  async search() {
    this.elasticsearchService.setSearchMode(SearchMode.KEYWORD);
    this.elasticsearchService.setSearchStatus(false);
    this.elasticsearchService.searchKeyword(this.searchKeyword);
    this.elasticsearchService.setCurrentSearchingPage(1);
    this._router.navigateByUrl("/search/result");
  }

  gotoMain() {
    this._router.navigateByUrl("");
  }

  checkRouterIsMain() {
    if (this._router.routerState.snapshot.url === "/") {
      this.isMain = true;
    } else {
      this.isMain = false;
    }
  }

  checkSearchRoute() {
    if (this._router.routerState.snapshot.url === "search/result") {
      this.isKeyLoaded = true;
    } else {
      this.isKeyLoaded = false;
    }
  }

  relatedSearch(keyword: string) {
    this.elasticsearchService.searchKeyword(keyword);
  }

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
}
