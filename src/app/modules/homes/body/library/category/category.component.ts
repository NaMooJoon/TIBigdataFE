import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../category-graph/category-graph.service";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from '../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { IdControlService } from "src/app/modules/homes/body/shared-services/id-control-service/id-control.service";
import { DocumentService } from "src/app/modules/homes/body/shared-services/document-service/document.service";
import { PaginationService } from "../../shared-services/pagination-service/pagination.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.less"]
})

export class CategoryComponent implements OnInit {
  constructor(private db: AnalysisDatabaseService,
    private idControl: IdControlService,
    private es: ElasticsearchService,
    private ds: DocumentService,
    private pg: PaginationService,
    public _router: Router) { }

  private data: any;
  private toggleTopics: boolean[];

  private categories: string[] = ["전체", "정치", "경제", "사회", "국제", "IT", "스포츠", "문화", "과학"];
  private dict_orders_1: string[] = ["전체", "가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"];
  private institutions: string[] = ["전체", "기관1", "기관2", "기관3"]//bring from the fe server

  private ALL: string = "ALL";//전체 선택했을 경우
  private cat_choice_init = [this.ALL, this.ALL, this.ALL,];//주제, 사전편찬순, 기관순 3가지 종류
  cat_button_choice: string[] = this.cat_choice_init;

  ngOnInit() {
    this.es.setKeyword("전체문서");
    this.es.setSearchMode(SEARCHMODE.ALL);
    this.pg.setCurrentPage(1);
    this.es.allSearchComplete();
    this.es.allCountComplete();
  }

  navToGraph(): void {
    this._router.navigateByUrl("body/library/graph");
  }

  toggleTopic(i: number): void {
    this.toggleTopics[i] = !this.toggleTopics[i];
  }

  navToDetail(doc) {
    // console.log(doc);
    let id = doc["idList"];
    this.idControl.selectOneID(id);
    this._router.navigateByUrl("search/DocDetail");

  }

  async selectCategory($event) {
    this.idControl.clearIDList();

    let ct = $event.target.innerText;
    let id = $event.target.id;

    console.log(id);
    switch (id) {
      case "topic": {
        console.log(ct);
        let docIDs = await this.getDocIDsFromTopic(ct);
        docIDs.map(e => this.idControl.pushIDList(e));
        let partialIDs: Object[] = this.idControl.getIDList().slice(0, this.es.getNumDocsPerPage());
        const ids: string[] = [];
        for (let i = 0; i < partialIDs.length; i++) {
          ids.push(partialIDs[i]['docId'])
        }

        this.es.setKeyword(ct)
        this.es.setSearchMode(SEARCHMODE.IDS);
        this.es.setCountNumChange(docIDs.length);
        this.pg.setCurrentPage(1);
        this.es.setIds(ids);
        this.es.multiIdSearchComplete();
      }

      case "dict": {
        this.cat_button_choice[1] = ct;
        break;
      }

      case "inst": {
        this.cat_button_choice[2] = ct;
        break;
      }
    }
  }

  async search_category() {
    this.idControl.clearIDList();
    let category = this.get_chosen_category();
    let docs_id = await this.getDocIDsFromTopic(category)//현재 토픽에 해당하는 내용을 불러온다.
    docs_id.map(e => this.idControl.pushIDList(e));
    this.es.setIds(docs_id);
    this.es.multiIdSearchComplete();
  }

  get_chosen_category() {
    return this.cat_button_choice[0];
  }

  async getDocIDsFromTopic(category) {
    // console.log(category)
    return await this.db.getOneTopicDocs(category) as [];
  }
}
