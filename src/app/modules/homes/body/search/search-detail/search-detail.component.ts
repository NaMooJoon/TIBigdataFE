import { Article } from "../../shared-modules/documents/article.interface";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { Component, OnInit } from '@angular/core';
import { WordcloudService } from '../../../graphs/wordcloud/wordcloud.service';
import { CloudData } from "angular-tag-cloud-module";
import { AnalysisDatabaseService } from "../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
import { DocumentService } from "../../shared-services/document-service/document.service";

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
    private documentService: DocumentService,
    private wordcloud: WordcloudService,
    private es: ElasticsearchService,
    private db: AnalysisDatabaseService
  ) { }

  ngOnInit() {
    this.load_new_document();

  }
  goToDoc(r) {
    this.documentService.selectOneID(this.rcmdList[r]["id"]);
    this.load_new_document();
  }

  async load_new_document() {
    // this.isLoaded = 0;
    this.isRelatedLoaded = 0;
    this.isCloudLoaded = 0;
    this.isDocInfoLoaded = 0;

    let id = this.documentService.getOneID();
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
