// import { Injectable } from '@angular/core';
import { IdControlService } from '../service/id-control-service/id-control.service';
import { Article } from "../../shared-module/common-search-result-document-list/article/article.interface";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { Component, OnInit, Inject } from '@angular/core';
// import { Article } from '../article/article.interface';
import { WordcloudService } from '../../../graphs/wordcloud/wordcloud.service';
import { CloudData, CloudOptions } from "angular-tag-cloud-module";
import { RecomandationService } from '../service/recommandation-service/recommandation.service';
import { AnalysisDatabaseService } from "../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.less']
})
export class SearchDetailComponent implements OnInit {

  private article: Article;
  private cData: CloudData[];
  private isRelatedLoaded = 0;
  private isCloudLoaded = 0;
  private isDocInfoLoaded = 0;
  private rcmdList: Array<string>;
  private relateToggle: boolean = false;
  constructor(
    private rcmd: RecomandationService,
    private idControl: IdControlService,
    private wordcloud: WordcloudService,
    private es: ElasticsearchService,
    private db: AnalysisDatabaseService
  ) { }

  ngOnInit() {
    console.log("loadpage : ngoninit");
    this.loadPage();


  }
  goToDoc(r) {
    // console.log(r)
    this.idControl.setIdChosen(this.rcmdList[r]["id"]);
    // console.log("goToDoc : ", this.rcmdList[r]["id"])
    this.loadPage();
    // this.rcmd.goToDoc(r);
  }

  loadPage() {
    // this.isLoaded = 0;
    this.isRelatedLoaded = 0;
    this.isCloudLoaded = 0;
    this.isDocInfoLoaded = 0;
    // this.relateToggle = false;
    // this.article = this.idControl.getArticle()["_source"];
    console.log("loadpage : loadpage")
    let id = this.idControl.getIdChosen();
    console.log("loadPage : id : " + id)
    // this.es.idSearch(id).then((r) =>{
    //   this.article = r;
    // });
    this.db.getRelatedDocs(id).then(res => {
      this.rcmdList = res as [];
      // console.log("loadPage : from db : ", res)
      // console.log("load page : get recommm ok")
      this.isRelatedLoaded ++;
    });
    // this.rcmd.getRcmd([id]).then((data)=>{
    //   // console.log(data);
    //   this.rcmdList = data as [];
    //   console.log("from rcmd : ", data)
    // })

    this.es.searchById(id).then((res) => {
      // this.article = res.hits.hits._source
      this.article = res["hits"]["hits"][0]["_source"];
      console.log("loadPage : es response ok : ", this.article);
      // console.log(this.article)
      this.isDocInfoLoaded ++;

    })
    this.wordcloud.createCloud(id)
      .then((data) => {
        // console.log("load{age : wordcloud info responseo ok")
        this.cData = data as CloudData[]
        this.isCloudLoaded ++;
        // console.log("cloud ok : ", true)
        // console.log("detail comp data store test : " + this.cData);
      });
    // let id = this.idControl.getArticle()["_id"];

    // console.log(this.article);
  }

  // cldData: CloudData;
  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value
    width: 600,
    height: 300,
    overflow: false
  };



}
