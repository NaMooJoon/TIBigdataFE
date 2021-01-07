import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../category-graph/category-graph.service";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from '../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';
import { SEARCHMODE, ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';

import { IdControlService } from "../../search/service/id-control-service/id-control.service";
import { map } from 'rxjs/operators';

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.less"]
})

export class CategoryComponent implements OnInit {
  constructor(private db: AnalysisDatabaseService,
    private configService: ConfigService,
    private idControl: IdControlService,
    private es: ElasticsearchService,
    public _router: Router) { }

  // is_cat_loaded: boolean = false;
  private data: any;
  private toggleTopics: boolean[];

  private categories: string[] = ["전체", "정치", "경제", "사회", "국제", "IT", "스포츠", "문화", "과학"];
  private dict_orders_1: string[] = ["전체", "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"];
  private dict_orders_2: string[] = ["ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "A-Z"];
  private institutions: string[] = ["전체", "기관1", "기관2", "기관3"]//bring from the fe server

  private ALL: string = "ALL";//전체 선택했을 경우
  private cat_choice_init = [this.ALL, this.ALL, this.ALL,];//주제, 사전편찬순, 기관순 3가지 종류
  cat_button_choice: string[] = this.cat_choice_init;

  private BT_PER_ROW: number = 9;//한 줄당 버튼의 수
  private bt_per_row: number[] = [];//줄당 버튼 수로 ngFor directive에 사용.
  ngOnInit() {
    for (var i = 0; i < this.BT_PER_ROW; i++) {
      this.bt_per_row[i] = i;
    }
    this.configService.getConfig().subscribe(data => {
      this.data = data as {};
      this.toggleTopics = [];

      var num_topic = data.length;
      for (let i = 0; i < num_topic; i++) {
        this.toggleTopics.push(false);
      }
    });
    this.es.setSearchMode(SEARCHMODE.ALL);
    this.es.setKeyword("전체문서")
    this.es.allCountComplete();
    this.es.allSearchComplete();
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
    this.idControl.selecOneID(id);
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

        console.log(docIDs)


        docIDs.map(e => this.idControl.pushIDList(e));
        let partialIDs = this.idControl.getIDList().slice(0, this.es.getDefaultNumDocsPerPage());
        this.es.setKeyword(ct)
        this.es.setCountNumChange(docIDs.length);
        this.es.multIdSearchComplete(partialIDs);
        break;
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
    // this.idControl.pushIDList(docs_id);
    this.es.multIdSearchComplete(docs_id);
  }

  get_chosen_category() {
    return this.cat_button_choice[0];
  }

  async getDocIDsFromTopic(category) {
    // console.log(category)
    return await this.db.getOneTopicDocs(category) as [];
  }
}
