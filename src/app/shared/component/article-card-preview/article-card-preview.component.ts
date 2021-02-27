import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from "src/app/core/services/analysis-database-service/analysis.database.service";
import { ArticleService } from "src/app/core/services/article-service/article.service";

@Component({
  selector: "app-article-details",
  templateUrl: "article-card-preview.component.html",
  styleUrls: ["article-card-preview.component.less"],
})
export class ArticleCardViewComponent implements OnInit {
  @Input() article: any;

  constructor(
    private db: AnalysisDatabaseService,
    public _router: Router,
    private documentService: ArticleService
  ) { }
  private keywords: any[] = [];
  private docId: string;

  ngOnInit() {
    this.docId = this.article._id;
    this.article = this.article._source;
    this.loadTopKeywords();
    if (this.article.file_download_url === undefined) {
      this.article.file_download_url = this.article.published_institution_url;
    }
  }

  /**
   * @description Update selected article and navigate to read article page. 
   */
  openDocDetail(): void {
    this.documentService.setSelectedId(this.docId);
    this.navToDocDetail();
  }

  /**
   * @description Load list of top keywords of current article
   */
  loadTopKeywords(): void {
    this.db.getTfidfVal(this.docId).then((res) => {
      let data = res as [];
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        this.keywords.push(tfVal);
      }
    });
  }

  navToDocDetail(): void {
    this._router.navigateByUrl("search/read");
  }
}
