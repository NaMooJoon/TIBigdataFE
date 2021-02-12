import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { AnalysisDatabaseService } from "../../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
import { DocumentService } from '../../../../shared-services/document-service/document.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.less']
})

export class ArticleDetailsComponent implements OnInit {

  @Input() article: any;

  constructor(
    private db: AnalysisDatabaseService,
    public _router: Router,
    private documentService: DocumentService,
  ) { }

  readonly DEBUG: boolean = false;
  private keywords: any[] = [];
  private docId: string;

  debug(...arg: any[]) {
    if (this.DEBUG)
      console.log(arg);
  }

  ngOnInit() {
    this.docId = this.article._id
    this.article = this.article._source;
    this.load_top_keywords();
    if (this.article.file_download_url === undefined) {
      this.article.file_download_url = this.article.published_institution_url
    }
  }

  openDocDetail(): void {
    this.documentService.setSelectedId(this.docId);
    this.navToDocDetail();
  }

  load_top_keywords() {
    this.db.getTfidfVal(this.docId).then(res => {
      let data = res as []
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        this.keywords.push(tfVal)
      }
    })
  }

  navToDocDetail() {
    this._router.navigateByUrl("search/DocDetail");
  }
}
