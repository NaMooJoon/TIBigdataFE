import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
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
    private es: ElasticsearchService // private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // console.log("search bar ng on init")  
  }

  updateKeyword($event) {
    this.queryText = $event.target.value;
  }

   search() {
     this.es.setSearchMode(SEARCHMODE.KEY);
     this.es.searchKeyword(this.queryText);
      //  this.es.setKeyword(this.queryText);
      // resolve()
    // }).then(() =>{
      this._router.navigateByUrl("body/search/result");
    // }
    // )
  }
}
