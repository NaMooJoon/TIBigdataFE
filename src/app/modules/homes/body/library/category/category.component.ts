import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../category-graph/category-graph.service";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from '../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';

import { IdControlService } from "../../search/service/id-control-service/id-control.service";


@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.less"]
})

export class CategoryComponent implements OnInit {
  constructor(private db: AnalysisDatabaseService,
    private configService: ConfigService,
    private idControl: IdControlService,
    public _router: Router) { }

  private isLoaded: boolean = false;
  private data: any;
  private toggleTopics: boolean[];
  private categories : string[] = ["전체", "정치", "경제", "사회", "국제", "IT", "스포츠", "문화"];
  private dict_orders : string[] = ["전체","ㄱ", "ㄴ", "ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ", "A-Z"];
  private institutions : string[] = ["전체","기관1", "기관2", "기관3"]//bring from the fe server
  cat_button_choice : string = "전체";
  ngOnInit() {
    // this.db.getTopicTable(true).then(data => {
      
    this.configService.getConfig().subscribe(data => {
      this.data = data as {};
      this.toggleTopics = [];

      var num_topic = data.length;
      for (let i = 0; i < num_topic; i++) {
        this.toggleTopics.push(false);

      }

      // let i = 0; 
      // let j = 0;
      // try {
      //   for (i = 0; i <= num_topic; i++) {
      //     let topic = data[i]["topic"];
      //     // console.log(topic);
      //     var num_doc = data[i]["doc"].length;
      //     // for (j = 0; j < num_doc; j++) {
      //     //   // console.log(data[i]["doc"][j]["title"])
      //     //   console.log("title " + j);
      //     // }
      //   }
      // } catch {
      //   console.log("ERROR : i is " + i + " and j is " + j);
      // }
      this.isLoaded = true;
    });
  }

  navToGraph(){
    console.log("cat graph?")
    this._router.navigateByUrl("body/library/graph");
  }

  toggleTopic(i) {
    this.toggleTopics[i] = !this.toggleTopics[i];
  }

  navToDetail(doc) {
    // console.log(doc);
    let id = doc["idList"];
    this.idControl.setIdChosen(id);
    this._router.navigateByUrl("search/DocDetail");

  }

  getTopic($event) {
    this.cat_button_choice  = $event.target.innerText;
  }
}
