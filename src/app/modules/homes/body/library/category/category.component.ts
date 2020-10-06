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

  /**
   * 
   * 현재 진입이 첫번째 자료열람 페이지 진입인지 확인한다.
   * ngOnchange lifecycle 사용해서 값 업데이트하는데, 처음 들어온 경우 전체 문서 로드해야 한다.
   * 
   */
  // check_is_all_docs(){
  //   this.searchMode = this.cat_button_choice == this.cat_choice_init ? true : false;
  //   console.log("cat compo : check is all docs : ", this.searchMode);
  // }

  async selectCategory($event) {
    this.idControl.clearIDList();

    let ct = $event.target.innerText;
    // console.log($event.target.innerText)
    let id = $event.target.id;
    switch (id){
      case "topic":{
        ct = this.convertTopicToEng(ct);
        let docIDs = await this.getDocIDsFromTopic(ct);
        // console.log("select category : ", docIDs);
        docIDs.map(e=>this.idControl.pushIDList(e));
        let partialIDs = this.idControl.getIDList().slice(0,this.es.getDefaultNumDocsPerPage());
        this.es.setKeyword(ct)

        this.es.setCountNumChange(docIDs.length);
        // this.idControl.pushIDList(docs_id);
        this.es.MultIdSearchComplete(partialIDs);
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

    // this.check_is_all_docs();
      // id 

    // this.cat_button_choice  = ct;
    // if(ct =="전체")
    // this.cat_button_choice = 
    // console.log("cat compo : ", this.cat_button_choice);
  }



  /***
 * 
 * 
 * 
 * 
 */

async search_category(){
  this.idControl.clearIDList();
  let category = this.get_chosen_category();

  switch (category){
    case "정치":
        category = "pol";
        break;
    case "경제":
        category = "eco";
        break;
    case "사회":
        category = "soc";
        break;
    case "문화":
        category = "cul";
        break;
    case "국제":
        category = "int";
        break;
    case "IT":
        category = "it";
        break;
    case "스포츠":
        category = "spo";
        break;
  }
     
  // if(category == "전체 
  


  let docs_id = await this.getDocIDsFromTopic(category)//현재 토픽에 해당하는 내용을 불러온다.
  docs_id.map(e=>this.idControl.pushIDList(e));
  // this.idControl.pushIDList(docs_id);
  this.es.MultIdSearchComplete(docs_id);
}

convertTopicToEng(category : string){

  switch (category){
    case "정치":
        category = "pol";
        break;
    case "경제":
        category = "eco";
        break;
    case "사회":
        category = "soc";
        break;
    case "문화":
        category = "cul";
        break;
    case "국제":
        category = "innt";
        break;
    case "IT":
        category = "it";
        break;
    case "스포츠":
        category = "spo";
        break;


  }
  return category;
}


get_chosen_category(){
  return this.cat_button_choice[0];
}


async getDocIDsFromTopic(category){
  // console.log(category)
  return await this.db.getOneTopicDocs(category) as [];
}

  getTopic($event) {
    this.cat_button_choice  = $event.target.innerText;
  }
}
