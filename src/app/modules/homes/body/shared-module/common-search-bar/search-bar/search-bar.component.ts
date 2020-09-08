import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { EventService } from "../../../../../communications/fe-backend-db/membership/event.service";
import { EPAuthService } from '../../../../../communications/fe-backend-db/membership/auth.service';
import { AnalysisDatabaseService } from '../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.less"]
})
export class SearchBarComponent implements OnInit {
  //Flask data
  //  private BASE_URL: string = 'http://localhost:5000/test';
  //  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  serverData: JSON;

  //  private static readonly INDEX = 'nkdboard';
  // private static readonly TYPE = 'nkdboard';

  @Input() queryText: string = "";
  // @Output() searchStart = new EventEmitter<any>();

  private lastKeypress = 0;

  // articleSources: ArticleSource[];

  isConnected = false;
  status: string;
  // subscription: Subscription;

  // searchKeyword: string;

  constructor(
    private db : AnalysisDatabaseService,
    private auth : EPAuthService,
    private eventSvs : EventService,
    public _router: Router,
    // private http:HttpClient,
    private es: ElasticsearchService // private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    // console.log("search bar on init")
    // this.es.getKeyword().subscribe(res=>{
    //   this.queryText = res;
    // })
    // console.log("bar : query text", this.queryText)
  }
  test(){
    console.log("abcde");
    // this._router.navigateByUrl("body/search/result");
  }
  updateKeyword($event) {
    this.queryText = $event.target.value;
    // console.log("bar comp : keyword accepted : " + this.queryText);
  }

  search() {
    // this.eventSvs.addSrchHst(this.queryText);
    // console.log("search function : ", this.queryText)
    // this.auth.test();
    // this.db.test();
    this.es.setKeyword(this.queryText);
    // this.es.fullTextSearch("post_body", this.queryText); //검색 결과 창에서 새로운 검색어 입력할 때 필요.
    // this.searchStart.emit();
    // this.auth.addSrchHst(this.queryText);
    // this.queryText = "기본값";
    // console.log("emitted!")
    // console.log("search bar : fulltextsearch done with " + this.queryText);
    this._router.navigateByUrl("body/search/result");
  }
}
