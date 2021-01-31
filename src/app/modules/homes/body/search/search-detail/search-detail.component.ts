// import { Injectable } from '@angular/core';
import { IdControlService } from "src/app/modules/homes/body/shared-services/id-control-service/id-control.service";
import { Article } from "../../shared-modules/documents/article/article.interface";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { Component, OnInit, Inject } from '@angular/core';
// import { Article } from '../article/article.interface';
import { WordcloudService } from '../../../graphs/wordcloud/wordcloud.service';
import { CloudData, CloudOptions } from "angular-tag-cloud-module";
import { RecommendationService } from "src/app/modules/homes/body/shared-services/recommendation-service/recommendation.service";
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
  private RelatedDocBtnToggle: boolean = false;
  constructor(
    private rcmd: RecommendationService,
    private idControl: IdControlService,
    private wordcloud: WordcloudService,
    private es: ElasticsearchService,
    private db: AnalysisDatabaseService
  ) { }

  ngOnInit() {
    this.load_new_document();

  }
  goToDoc(r) {
    this.idControl.selectOneID(this.rcmdList[r]["id"]);
    this.load_new_document();
  }

  async load_new_document() {
    // this.isLoaded = 0;
    this.isRelatedLoaded = 0;
    this.isCloudLoaded = 0;
    this.isDocInfoLoaded = 0;

    let id = this.idControl.getOneID();
    this.es.setIds([id]);

    this.db.loadRelatedDocs(id).then(res => {
      this.rcmdList = res as [];
      this.isRelatedLoaded++;
    });

    await this.es.searchById().then((res) => {
      this.article = res["hits"]["hits"][0]["_source"];
      console.log(this.article)
      this.isDocInfoLoaded++;
    })

    this.wordcloud.createCloud(id)
      .then((data) => {
        this.cData = data as CloudData[]
        this.isCloudLoaded++;
      });
  }

  isDataEmpty(data: any) {
    if (data === undefined || data === null || data === " ") return true;
    else return false;
  }
}
