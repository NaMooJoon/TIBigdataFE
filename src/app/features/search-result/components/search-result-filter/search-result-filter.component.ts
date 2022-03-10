import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import {SearchMode} from '../../../../core/enums/search-mode';
import {ArticleService} from '../../../../core/services/article-service/article.service';
import {AnalysisDatabaseService} from '../../../../core/services/analysis-database-service/analysis.database.service';
import {Router} from '@angular/router';

@Component({
  selector: "app-search-result-filter",
  templateUrl: "./search-result-filter.component.html",
  styleUrls: ["./search-result-filter.component.less"],
})
export class SearchResultFilterComponent implements OnInit, OnDestroy {
  private searchKeyword: string;

  private _institutionList: Array<Object>;
  private articleSubscriber: Subscription;
  private searchSubscriber: Subscription;
  private _selectedInst: string;
  private isSearchFilter: boolean = false;

  private _datePickerStartDate: string;
  private _datePickerEndDate: string;
  private _selectedDate: string;

  private _selectedTp: string;
  private _startDate: string;
  private _endDate: string;
  private _mustKeyword: string;
  private _mustNotKeyword: string;


  public _topics = [
    "정치",
    "경제",
    "사회",
    "국제",
    "IT_과학",
    "스포츠",
    "문화",
  ];

  constructor(private router: Router,
              private elasticsearchService: ElasticsearchService,
              private articleService: ArticleService,
              private analysisDatabaseService: AnalysisDatabaseService) {
    this.articleSubscriber = this.elasticsearchService
      .getArticleChange()
      .subscribe(() => {
        this.loadInstitutions();
      });
    this.searchSubscriber = this.elasticsearchService
      .getSearchStatus()
      .subscribe(() => {
        this.setSearchKeyword();
      });
    this._datePickerEndDate = null;
    this._datePickerStartDate = null;

    this.selectedInst = "";
    this._selectedTp = "false";
    this._startDate = null;
    this._endDate = null;
    this._mustKeyword = "";
    this._mustNotKeyword = "";
  }

  ngOnInit() {
    this.loadInstitutions();
    this.setSearchKeyword();
  }

  ngOnDestroy() {
    this.articleSubscriber.unsubscribe();
    this.searchSubscriber.unsubscribe();
  }

  /**
   * @description Load institutions list of documents
   */
  async loadInstitutions() {
    let res = await this.elasticsearchService.getInstitutionsWithTextSearch();
    this.institutionList = res["aggregations"]["count"]["buckets"];
  }

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

  /**
   * @description Select institutions and set as user selected
   * @param inst
   */
  selectInst(inst: { key: string; doc_num: number }) {
    this.selectedInst = inst.key;
  }

  resetFilters() {
    this.selectInst = null;
  }

  selectSearchFilter(): void {
    this.isSearchFilter = !this.isSearchFilter;
  }

  setSearchKeyword() {
    this.searchKeyword = this.elasticsearchService.getKeyword();
  }

  public get getSearchKeyword(): string {
    return this.searchKeyword;
  }

  public get isSelectSearchFilter(): boolean {
    return this.isSearchFilter;
  }

  // getters and setters
  public get institutionList(): Array<Object> {
    return this._institutionList;
  }

  public set institutionList(value: Array<Object>) {
    this._institutionList = value;
  }

  public get selectedInst(): string {
    return this._selectedInst;
  }

  public set selectedInst(value: string) {
    this._selectedInst = value;
  }

  //new
  async selectDate(e) {
    this.selectedDate = e.target.innerText.toString();
    let startTime: Date;
    let endTime: Date;
    let date = new Date();

    switch (this.selectedDate) {
      case "1일": {
        endTime = new Date()
        startTime = new Date(date.setDate(date.getDate() - 1));

        this._startDate = toStringByFormatting(startTime);
        this._endDate = toStringByFormatting(endTime);
        break;
      }

      case "1주": {
        endTime = new Date()
        startTime = new Date(date.setDate(date.getDate() - 7));

        this._startDate = toStringByFormatting(startTime);
        this._endDate = toStringByFormatting(endTime);
        break;
      }

      case "1개월": {
        endTime = new Date()
        startTime = new Date(date.setMonth(date.getMonth() - 1));

        this._startDate = toStringByFormatting(startTime);
        this._endDate = toStringByFormatting(endTime);
        break;
      }

      case "3개월": {
        endTime = new Date()
        startTime = new Date(date.setMonth(date.getMonth() - 3));

        this._startDate = toStringByFormatting(startTime);
        this._endDate = toStringByFormatting(endTime);
        break;
      }

      case "6개월": {
        endTime = new Date()
        startTime = new Date(date.setMonth(date.getMonth() - 6));

        this._startDate = toStringByFormatting(startTime);
        this._endDate = toStringByFormatting(endTime);
        break;
      }

      case "1년": {
        endTime = new Date()
        startTime = new Date(date.setFullYear(date.getFullYear() - 1));

        this._startDate = toStringByFormatting(startTime);
        this._endDate = toStringByFormatting(endTime);
        break;
      }

      case "전체": {
        this._startDate = "0000-00-00";
        this._endDate = "9999-99-99";
        break;
      }

      default : {
        if ((this.datePickerStartDate === null) || (this.datePickerEndDate === null)) {
          alert("날짜를 선택해 주세요.");
        } else {
          this._endDate = this.datePickerEndDate;
          this._startDate = this.datePickerStartDate;

          if (this._startDate > this._endDate) {
            alert("날짜를 다시 선택해 주세요.");
          }
        }
        break;
      }
    }

    function leftPad(value) {
      if (value >= 10) {
        return value;
      }
      return `0${value}`;
    }

    function toStringByFormatting(source, delimiter = '-') {
      const year = source.getFullYear();
      const month = leftPad(source.getMonth() + 1);
      const day = leftPad(source.getDate());
      return [year, month, day].join(delimiter);
    }

  }

  setDatePickerStartDate(e) {
    this._datePickerStartDate = e.target.value;
  }

  public get datePickerStartDate(): string {
    return this._datePickerStartDate;
  }

  setDatePickerEndDate(e) {
    this._datePickerEndDate = e.target.value;
  }

  public get datePickerEndDate(): string {
    return this._datePickerEndDate;
  }

  public get selectedDate(): string {
    return this._selectedDate;
  }

  public set selectedDate(value: string) {
    this._selectedDate = value;
  }

  public get topics(): string[] {
    return this._topics;
  }

  public get selectedTp(): string {
    return this._selectedTp;
  }

  public set selectedTp(value: string) {
    this._selectedTp = value;
  }

  async selectTopic($event) {
    this.selectedTp = $event.target.innerText;;

    let hashKeys = await this.getDocIDsFromTopic(this.selectedTp);
    hashKeys.map((e) => this.articleService.addHashKey(e));

    let partialIDs: Object[] = this.articleService
      .getList()
      .slice(0, this.elasticsearchService.getNumDocsPerPage());

    const ids: string[] = [];

    for (let i = 0; i < partialIDs.length; i++) {
      ids.push(partialIDs[i]["hashKey"]);
    }

    this.elasticsearchService.setKeyword(this.selectedTp);
    this.elasticsearchService.setSearchMode(SearchMode.HASHKEYS);
    this.elasticsearchService.setArticleNumChange(hashKeys.length);
    this.elasticsearchService.setHashKeys(ids);
    this.elasticsearchService.multiHashKeySearchComplete();
  }

  async getDocIDsFromTopic(category) {
    return (await this.analysisDatabaseService.getOneTopicDocs(category)) as [];
  }

  toKeywordAnalysis(): void {
    this.router.navigateByUrl("/search/keywordAnalysis");
  }

  mustKeyword(e) {
    this._mustKeyword = e.target.value.toString();
  }

  mustNotKeyword(e) {
    this._mustNotKeyword = e.target.value.toString();
  }

  async resetSearch() {
    this.elasticsearchService.setSearchMode(SearchMode.KEYWORD);
    this.elasticsearchService.triggerSearch(1);
  }

  async confirm($event) {
    this.elasticsearchService.setSelectedDate(this._startDate, this._endDate);
    this.elasticsearchService.setSelectedInst(this.selectedInst);
    this.elasticsearchService.setSelectedKeyword(this._mustKeyword,this._mustNotKeyword);

    console.log("mustKeyword : ", this.elasticsearchService.getMustKeyword);
    console.log("mustNotKeyword : ", this.elasticsearchService.getMustNotKeyword);
    console.log("startTime : ", this.elasticsearchService.getStartTime);
    console.log("endTime : ", this.elasticsearchService.getEndTime);
    console.log("selectedInst : ", this.elasticsearchService.getSelectedInst);

    this.elasticsearchService.setSearchMode(SearchMode.FILTER);
    this.elasticsearchService.triggerSearch(1);
    // this.elasticsearchService.searchBySearchFilterComplete(1);

  }
}
