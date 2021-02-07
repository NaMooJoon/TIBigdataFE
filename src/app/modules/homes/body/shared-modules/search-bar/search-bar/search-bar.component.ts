import { preserveWhitespacesDefault } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { PaginationService } from "../../../shared-services/pagination-service/pagination.service";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.less"]
})
export class SearchBarComponent implements OnInit {

  private queryText: string = "";
  private selectedDate: string;
  private dateList: Array<String> = ["전체", "1일", "1주일", "1개월", "3개월", "6개월", "1년"];
  private topicList: Array<String> = ["전체", "경제", "국제", "문화", "스포츠", "정치", "지역"];
  private isDateSelected: boolean = false;
  private isInstSelected: boolean = false;
  private isTopicSelected: boolean = false;
  private selectedInst: string;
  private selectedTopic: string;
  private isMain: Boolean = false;

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        'color': 'white',
        'background-color': '#0FBAFF'
      }
    }
    else {
      return {
        'color': 'black',
        'background-color': 'white'
      };
    }
  }

  constructor(
    public _router: Router,
    private es: ElasticsearchService,
    private ps: PaginationService
  ) { }

  ngOnInit() {
    this.selectedDate = "기간";
    this.selectedInst = "기관";
    this.selectedTopic = "주제별";
    this.isDateSelected = false;
    this.isInstSelected = false;
    this.isTopicSelected = false;

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

  updateKeyword($event) {
    this.queryText = $event.target.value;
  }

  resetFilters() {
    this.ngOnInit();
  }

  async search() {
    this.es.setSearchStatus(false);
    this.es.searchKeyword(this.queryText);
    this.es.setSearchMode(SEARCHMODE.KEYWORD);
    this._router.navigateByUrl("body/search/result");
  }

  gotoMain() {
    this._router.navigateByUrl("");
  }

  checkRouterIsMain() {
    if (this._router.routerState.snapshot.url === "/" || this._router.routerState.snapshot.url === "/homes") {
      this.isMain = true;
    }
    else {
      this.isMain = false;
    }
  }
}
