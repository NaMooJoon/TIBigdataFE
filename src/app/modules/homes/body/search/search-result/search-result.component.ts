import {
  Component,
  OnInit,
  // ChangeDetectorRef,
  // Input,
  // Inject,
  // Output
} from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../../shared-module/common-search-result-document-list/article/article.interface";
import { Subscription } from "rxjs";
// import { Observable, of } from "rxjs";
import { IdControlService } from "../service/id-control-service/id-control.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DocumentService } from "../service/document/document.service";

import { IpService } from "src/app/ip.service";
import { RecomandationService } from "../service/recommandation-service/recommandation.service";
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { EventService } from "../../../../communications/fe-backend-db/membership/event.service";
import { AnalysisDatabaseService } from "../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";


@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.less"]
})
export class SearchResultComponent implements OnInit {

  public relatedKeywords = [];
  queryText: string;

  constructor(
    private auth: EPAuthService,
    public _router: Router,
    private es: ElasticsearchService,
  ) {
  }
  ngOnInit() {
  }


  setRelatedKeywords(keys: string[]) {
    this.relatedKeywords = keys;
  }

  //Get result from flask
  async freqAnalysis() {
    this._router.navigateByUrl("search/freqAnalysis");
  }

  relatedSearch(keyword: string) {
    this.es.searchKeyword(keyword);
    this.auth.addSrchHst(this.queryText);
  }
}
