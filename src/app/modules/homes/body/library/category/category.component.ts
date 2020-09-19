import { Component, OnInit } from "@angular/core";
import { ConfigService } from "../category-graph/category-graph.service";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from '../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';

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
    public _router: Router) { }

  // is_cat_loaded: boolean = false;
  private data: any;
  private toggleTopics: boolean[];

  is_lib_first : boolean = true;

  private categories : string[] = ["전체", "정치", "경제", "사회", "국제", "IT", "스포츠", "문화", "과학"];
  private dict_orders_1 : string[] = ["전체","ㄱ", "ㄴ", "ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ"];
  private dict_orders_2 : string[] = ["ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ", "A-Z"];
  private institutions : string[] = ["전체","기관1", "기관2", "기관3"]//bring from the fe server

  private ALL : string = "ALL";//전체 선택했을 경우
  private cat_choice_init = [this.ALL, this.ALL, this.ALL,];//주제, 사전편찬순, 기관순 3가지 종류
  cat_button_choice : string[] = this.cat_choice_init;

  private BT_PER_ROW : number = 9;//한 줄당 버튼의 수
  private bt_per_row : number[] =[];//줄당 버튼 수로 ngFor directive에 사용.
  ngOnInit() {

    console.log("category compo")
    for(var i = 0 ; i < this.BT_PER_ROW; i++){
      this.bt_per_row[i] = i;
    }

      
    this.configService.getConfig().subscribe(data => {
      this.data = data as {};
      this.toggleTopics = [];

      var num_topic = data.length;
      for (let i = 0; i < num_topic; i++) {
        this.toggleTopics.push(false);

      }


      this.is_lib_first = true;
    });

    this.check_is_all_docs();
  }

  navToGraph(){
    // console.log("cat graph?")
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



  /**
   * 
   * 현재 진입이 첫번째 자료열람 페이지 진입인지 확인한다.
   * ngOnchange lifecycle 사용해서 값 업데이트하는데, 처음 들어온 경우 전체 문서 로드해야 한다.
   * 
   */
  check_is_all_docs(){
    this.is_lib_first = this.cat_button_choice == this.cat_choice_init ? true : false;
    console.log("cat compo : check is all docs : ", this.is_lib_first);
  }

  getCategory($event) {
    let ct = $event.target.innerText;
    console.log($event.target.id)
    let id = $event.target.id;
    switch (id){
      case "topic":{
        this.cat_button_choice[0] = ct;
        break;
      }

      case "dict":{
        this.cat_button_choice[1] = ct;
        break;
      }

      case "inst":{
        this.cat_button_choice[2] = ct;
        break;
      }
    }

    this.check_is_all_docs();
      // id 

    // this.cat_button_choice  = ct;
    // if(ct =="전체")
    // this.cat_button_choice = 
    // console.log("cat compo : ", this.cat_button_choice);
  }
}
