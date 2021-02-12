import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../category-graph/category-graph.service";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from '../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { DocumentService } from "src/app/modules/homes/body/shared-services/document-service/document.service";
import { PaginationService } from "../../shared-services/pagination-service/pagination.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.less"]
})

export class CategoryComponent implements OnInit {
  constructor(private db: AnalysisDatabaseService,
    private es: ElasticsearchService,
    private ds: DocumentService,
    private pg: PaginationService,
    public _router: Router) { }

  private data: any;
  private toggleTopics: boolean[];

  private categories: string[] = ["전체", "정치", "경제", "사회", "국제", "IT", "스포츠", "문화", "과학"];
  private dict_orders_1: string[] = ["전체", "가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하"];
  private institutionList: string[];
  private selectedInst: string;

  private ALL: string = "ALL";//전체 선택했을 경우
  private cat_choice_init = [this.ALL, this.ALL, this.ALL,];//주제, 사전편찬순, 기관순 3가지 종류
  cat_button_choice: string[] = this.cat_choice_init;

  ngOnInit() {
    this.es.setSearchMode(SEARCHMODE.ALL);
    this.es.setCurrentSearchingPage(1);
    this.loadInstitutions();
  }

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        'color': 'white',
        'background-color': '#0FBAFF',
        'border': 'none'
      }
    }
    else {
      return {
        'color': 'black',
        'background-color': 'white'
      };
    }
  }

  async loadInstitutions() {
    let res = await this.es.getInstitutions();
    this.institutionList = res['aggregations']['count']['buckets'];
  }

  navToGraph(): void {
    this._router.navigateByUrl("body/library/graph");
  }

  toggleTopic(i: number): void {
    this.toggleTopics[i] = !this.toggleTopics[i];
  }

  navToDetail(doc) {
    let id = doc["idList"];
    this.ds.setSelectedId(id);
    this._router.navigateByUrl("search/DocDetail");
  }

  async selectCategory($event, doc?) {
    this.ds.clearList();

    let ct = $event.target.innerText;
    let id = $event.target.id;

    console.log(id, doc);
    switch (id) {
      case "topic": {
        console.log(ct);
        let docIDs = await this.getDocIDsFromTopic(ct);
        docIDs.map(e => this.ds.addId(e));
        let partialIDs: Object[] = this.ds.getList().slice(0, this.es.getNumDocsPerPage());
        const ids: string[] = [];
        for (let i = 0; i < partialIDs.length; i++) {
          ids.push(partialIDs[i]['docId'])
        }

        this.es.setKeyword(ct)
        this.es.setSearchMode(SEARCHMODE.IDS);
        this.es.setArticleNumChange(docIDs.length);
        this.es.setIds(ids);
        this.es.multiIdSearchComplete();
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
    this.ds.clearList();
    let category = this.get_chosen_category();
    let docs_id = await this.getDocIDsFromTopic(category)//현재 토픽에 해당하는 내용을 불러온다.
    docs_id.map(e => this.ds.addId(e));
    this.es.setIds(docs_id);
    this.es.multiIdSearchComplete();
  }

  async selectInstitution(institution: { key: string, doc_count: number }) {
    this.selectedInst = institution.key;
    this.es.setSearchMode(SEARCHMODE.INST);
    this.es.setSelectedInst(institution.key);
    this.es.triggerSearch(1)

  }

  get_chosen_category() {
    return this.cat_button_choice[0];
  }

  async getDocIDsFromTopic(category) {
    // console.log(category)
    return await this.db.getOneTopicDocs(category) as [];
  }
}
