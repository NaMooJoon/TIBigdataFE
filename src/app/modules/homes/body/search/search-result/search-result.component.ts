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
  private RCMD_URL: string = this.ipService.getFrontDBServerIp() + ":5000/rcmd";
  // private searchResultIdList: string[] = [];
  // private keepIdList : string [] = [];
  // private relatedDocs: ArticleSource[][] = [];
  // private userSearchHistory: string[];
  // private isSearchLoaded: boolean = false;
  // private isRelatedLoaded: boolean = true;//going to be removed
  // isKeyLoaded: boolean = false;
  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });
  // private articleSources: ArticleSource[];
  // private subscription: Subscription;
  private searchKeyword: string;
  // private isToggleRelated: boolean
  // private relateToggle: Array<boolean>;
  // private isLogStat: Number = 0;

  queryText: string;

  constructor(
    private auth: EPAuthService,
    private evtSvs: EventService,
    private rcmd: RecomandationService,
    private ipService: IpService,
    private idControl: IdControlService,
    public _router: Router,
    private http: HttpClient,
    private es: ElasticsearchService, //private cd: ChangeDetectorRef.
    private db: AnalysisDatabaseService,
    private docControl: DocumentService

  ) {
    // this.isConnected = false;
    // this.subscription = this.es.articleInfo$.subscribe(info => {
    // this.articleSources = info;
    // //this.debug(info)
    // });
  }
  ngOnInit() {

    // this.debug("search result compo")
    // this.idControl.clearAll();
    //this.debug(this.evtSvs.getSrchHst());
    // this.auth.getLogInObs().subscribe(stat=>{
    //   this.isLogStat = stat;
    // })
    // this.isLogStat = this.auth.getLogInStat()
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
    // this.queryText = keyword;
    this.auth.addSrchHst(this.queryText);

    // this.loadResultPage();
  }



}
