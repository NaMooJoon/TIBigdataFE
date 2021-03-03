import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from "src/app/core/services/analysis-database-service/analysis.database.service";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import { SearchMode } from "src/app/core/enums/search-mode";
import { ArticleService } from "src/app/core/services/article-service/article.service";

@Component({
  selector: "app-category-library",
  templateUrl: "./article-library.component.html",
  styleUrls: ["./article-library.component.less"],
})
export class ArticleLibraryComponent implements OnInit {
  constructor(
    private analysisDatabaseService: AnalysisDatabaseService,
    private elasticsearchService: ElasticsearchService,
    private articleService: ArticleService,
    public _router: Router
  ) { }

  private _toggleTopics: boolean[];
  private _institutionList: string[];
  private _selectedInst: string;
  private _all: string = "ALL"; //전체 선택했을 경우
  private _cat_choice_init = [this.all, this.all, this.all]; //주제, 사전편찬순, 기관순 3가지 종류
  private _cat_button_choice: string[] = this.cat_choice_init;
  private _categories: string[] = [
    "전체",
    "정치",
    "경제",
    "사회",
    "국제",
    "IT",
    "스포츠",
    "문화",
    "과학",
  ];
  private _dict_orders_1: string[] = [
    "전체",
    "가",
    "나",
    "다",
    "라",
    "마",
    "바",
    "사",
    "아",
    "자",
    "차",
    "카",
    "타",
    "파",
    "하",
  ];


  ngOnInit() {
    this.elasticsearchService.setSearchMode(SearchMode.ALL);
    this.elasticsearchService.setCurrentSearchingPage(1);
    this.loadInstitutions();
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
   * @description Load institutions list 
   */
  async loadInstitutions() {
    let res = await this.elasticsearchService.getInstitutions();
    this.institutionList = res["aggregations"]["count"]["buckets"];
  }

  /**
   * @description Router to library/research-status 
   */
  navToGraph(): void {
    this._router.navigateByUrl("library/research-status");
  }

  toggleTopic(i: number): void {
    this.toggleTopics[i] = !this.toggleTopics[i];
  }

  navToDetail(doc) {
    let id = doc["idList"];
    this.articleService.setSelectedId(id);
    this._router.navigateByUrl("search/read");
  }

  /**
   * @description Select category of topic ot dictionary order or institution 
   * @param $event 
   * @param doc 
   */
  async selectCategory($event, doc?) {
    this.articleService.clearList();

    let ct = $event.target.innerText;
    let id = $event.target.id;


    switch (id) {
      case "topic": {
        let docIDs = await this.getDocIDsFromTopic(ct);
        console.log(docIDs);
        docIDs.map((e) => this.articleService.addId(e));
        let partialIDs: Object[] = this.articleService
          .getList()
          .slice(0, this.elasticsearchService.getNumDocsPerPage());
        const ids: string[] = [];
        for (let i = 0; i < partialIDs.length; i++) {
          ids.push(partialIDs[i]["docId"]);
        }


        this.elasticsearchService.setKeyword(ct);
        this.elasticsearchService.setSearchMode(SearchMode.IDS);
        this.elasticsearchService.setArticleNumChange(docIDs.length);
        this.elasticsearchService.setIds(ids);
        this.elasticsearchService.multiIdSearchComplete();
      }

      case "dict": {
        this.cat_button_choice[1] = ct;
        break;
      }

      case "inst": {
        this.cat_button_choice[2] = ct;
        this.selectInstitution(doc);
        break;
      }
    }
  }

  async search_category() {
    this.articleService.clearList();
    let category = this.get_chosen_category();
    let docs_id = await this.getDocIDsFromTopic(category); //현재 토픽에 해당하는 내용을 불러온다.
    docs_id.map((e) => this.articleService.addId(e));
    this.elasticsearchService.setIds(docs_id);
    this.elasticsearchService.multiIdSearchComplete();
  }

  /**
   * @description Select institutions and set search mode as selected 
   * @param institution 
   */
  async selectInstitution(institution: { key: string; doc_count: number }) {
    if (institution === null || this.selectedInst === institution.key) {
      this.elasticsearchService.setSearchMode(SearchMode.ALL);
      this.selectedInst = "전체";
      this.elasticsearchService.triggerSearch(1);
    } else {
      this.selectedInst = institution.key;
      this.elasticsearchService.setSearchMode(SearchMode.INST);
      this.elasticsearchService.setSelectedInst(institution.key);
      this.elasticsearchService.triggerSearch(1);
    }
  }

  get_chosen_category() {
    return this.cat_button_choice[0];
  }

  /**
   * @description Return document ID from topic category 
   * @param category 
   */
  async getDocIDsFromTopic(category) {
    return (await this.analysisDatabaseService.getOneTopicDocs(category)) as [];
  }

  // getters and setters
  public get toggleTopics(): boolean[] {
    return this._toggleTopics;
  }
  public set toggleTopics(value: boolean[]) {
    this._toggleTopics = value;
  }
  public get institutionList(): string[] {
    return this._institutionList;
  }
  public set institutionList(value: string[]) {
    this._institutionList = value;
  }
  public get selectedInst(): string {
    return this._selectedInst;
  }
  public set selectedInst(value: string) {
    this._selectedInst = value;
  }
  public get all(): string {
    return this._all;
  }
  public set all(value: string) {
    this._all = value;
  }
  public get cat_choice_init() {
    return this._cat_choice_init;
  }
  public set cat_choice_init(value) {
    this._cat_choice_init = value;
  }
  public get cat_button_choice(): string[] {
    return this._cat_button_choice;
  }
  public set cat_button_choice(value: string[]) {
    this._cat_button_choice = value;
  }
  public get categories(): string[] {
    return this._categories;
  }
  public set categories(value: string[]) {
    this._categories = value;
  }
  public get dict_orders_1(): string[] {
    return this._dict_orders_1;
  }
  public set dict_orders_1(value: string[]) {
    this._dict_orders_1 = value;
  }
}
