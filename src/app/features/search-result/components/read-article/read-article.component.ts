import { Component, OnInit } from "@angular/core";
import { CloudData } from "angular-tag-cloud-module";
import { Article } from "src/app/core/models/article.model";
import { AnalysisDatabaseService } from "src/app/core/services/analysis-database-service/analysis.database.service";
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import { WordcloudService } from "src/app/core/services/wordcloud-service/wordcloud.service";

@Component({
  selector: "app-read-article",
  templateUrl: "./read-article.component.html",
  styleUrls: ["./read-article.component.less"],
})
export class ReadArticle implements OnInit {
  private article: Article;
  private cData: CloudData[];
  private isRelatedLoaded = 0;
  private isCloudLoaded = 0;
  private isDocInfoLoaded = 0;
  private rcmdList: Array<string>;
  private RelatedDocBtnToggle: boolean = false;
  constructor(
    private articleService: ArticleService,
    private wordcloud: WordcloudService,
    private es: ElasticsearchService,
    private db: AnalysisDatabaseService
  ) { }

  ngOnInit() {
    this.load_new_document();
  }
  goToDoc(r) {
    this.articleService.setSelectedId(this.rcmdList[r]["id"]);
    this.load_new_document();
  }

  async load_new_document() {
    // this.isLoaded = 0;
    this.isRelatedLoaded = 0;
    this.isCloudLoaded = 0;
    this.isDocInfoLoaded = 0;

    let id = this.articleService.getSelectedId();
    this.es.setIds([id]);

    this.db.loadRelatedDocs(id).then((res) => {
      this.rcmdList = res as [];
      this.isRelatedLoaded++;
    });

    await this.es.searchById().then((res) => {
      this.article = res["hits"]["hits"][0]["_source"];

      this.isDocInfoLoaded++;
    });

    this.wordcloud.createCloud(id).then((data) => {
      this.cData = data as CloudData[];
      this.isCloudLoaded++;
    });
  }

  isDataEmpty(data: any) {
    if (data === undefined || data === null || data === " ") return true;
    else return false;
  }
}
