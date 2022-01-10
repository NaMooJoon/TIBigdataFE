import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import {SearchMode} from '../../../../core/enums/search-mode';
import {ArticleService} from '../../../../core/services/article-service/article.service';
import {AnalysisDatabaseService} from '../../../../core/services/analysis-database-service/analysis.database.service';

@Component({
  selector: "app-search-result-filter",
  templateUrl: "./search-result-filter.component.html",
  styleUrls: ["./search-result-filter.component.less"],
})
export class SearchResultFilterComponent implements OnInit, OnDestroy {

  private _institutionList: Array<Object>;
  private articleSubscriber: Subscription;
  private _selectedInst: string;
  private isSearchFilter: boolean = false;

  private _datePickerStartDate: string;
  private _datePickerEndDate: string;
  private _selectedDate: string;

  private _selectedTp: string;

  private _mustKeyword: string = "";
  private _mustNotKeyword : string = "";

  public _topics = [
    "정치",
    "경제",
    "사회",
    "국제",
    "IT_과학",
    "스포츠",
    "문화",
  ];

  constructor(private elasticsearchService: ElasticsearchService,
              private articleService: ArticleService,
              private analysisDatabaseService: AnalysisDatabaseService) {
    this.articleSubscriber = this.elasticsearchService
      .getArticleChange()
      .subscribe(() => {
        this.loadInstitutions();
      });
    this._datePickerEndDate = null;
    this._datePickerStartDate = null;
  }

  ngOnInit() {
    this.loadInstitutions();

  }

  ngOnDestroy() {
    this.articleSubscriber.unsubscribe();
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
   * @description show help message for "keyword analysis"
   * when user click the help button beside the "keyword analysis" button.
   */
showHelpMessage() {
}

  /**
   * @description Select institutions and set as user selected
   * @param inst
   */
  selectInst(inst: { key: string; doc_num: number }) {
    this.selectedInst = inst.key;
    this.elasticsearchService.setSearchMode(SearchMode.INST);
    this.elasticsearchService.setSelectedInst(inst.key);
    this.elasticsearchService.triggerSearch(1);
  }

  resetFilters() {
    this.selectInst = null;
  }

  selectSearchFilter(): void {
    this.isSearchFilter = !this.isSearchFilter;
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

        this.startDateSearch(toStringByFormatting(startTime), toStringByFormatting(endTime));
        break;
      }

      case "1주": {
        endTime = new Date()
        startTime = new Date(date.setDate(date.getDate() - 7));

        this.startDateSearch(toStringByFormatting(startTime), toStringByFormatting(endTime));
        break;
      }

      case "1개월": {
        endTime = new Date()
        startTime = new Date(date.setMonth(date.getMonth() - 1));

        this.startDateSearch(toStringByFormatting(startTime), toStringByFormatting(endTime));
        break;
      }

      case "3개월": {
        endTime = new Date()
        startTime = new Date(date.setMonth(date.getMonth() - 3));

        this.startDateSearch(toStringByFormatting(startTime), toStringByFormatting(endTime));
        break;
      }

      case "6개월": {
        endTime = new Date()
        startTime = new Date(date.setMonth(date.getMonth() - 6));

        this.startDateSearch(toStringByFormatting(startTime), toStringByFormatting(endTime));
        break;
      }

      case "1년": {
        endTime = new Date()
        startTime = new Date(date.setFullYear(date.getFullYear() - 1));

        this.startDateSearch(toStringByFormatting(startTime), toStringByFormatting(endTime));
        break;
      }

      case "전체": {
        this.elasticsearchService.setSearchMode(SearchMode.KEYWORD);
        this.elasticsearchService.triggerSearch(1);

        break;
      }

      default : {
        if ((this.datePickerStartDate === null) || (this.datePickerEndDate === null)) {
          alert("날짜를 선택해 주세요.");
        } else {
          let endTime2 = this.datePickerEndDate;
          let startTime2 = this.datePickerStartDate;

          if (startTime2 > endTime2) {
            alert("날짜를 다시 선택해 주세요.");
          } else {
            this.startDateSearch(startTime2, endTime2);
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

  startDateSearch(startTime: string, endTime: string) {
    this.elasticsearchService.setSearchMode(SearchMode.DATE);
    this.elasticsearchService.setSelectedDate(startTime, endTime);
    this.elasticsearchService.triggerSearch(1);
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

  selectKeywords($event) {
    console.log(this._mustKeyword,this._mustNotKeyword)
    this.elasticsearchService.setSelectedKeyword(this._mustKeyword,this._mustNotKeyword);
    this.elasticsearchService.setSearchMode(SearchMode.KEYWORDOPTION);
    this.elasticsearchService.triggerSearch(1);

  }


  mustKeyword(e) {
    this._mustKeyword = e.target.value.toString();
  }

  mustNotKeyword(e) {
    this._mustNotKeyword = e.target.value.toString();
  }

}
