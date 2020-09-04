import {
  Component,
  OnInit,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  Output
} from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { ArticleSource } from "../../../../containers/shared/article.interface";
import { Subscription } from "rxjs";
import { Observable, of } from "rxjs";
import { EventService } from "../../../../../communications/fe-backend-db/membership/event.service";
import { EPAuthService } from '../../../../../communications/fe-backend-db/membership/auth.service';

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
  @Output() searched = new EventEmitter<any>();

  private lastKeypress = 0;

  // articleSources: ArticleSource[];

  isConnected = false;
  status: string;
  // subscription: Subscription;

  // searchKeyword: string;

  constructor(
    private auth : EPAuthService,
    private eventSvs : EventService,
    public _router: Router,
    // private http:HttpClient,
    private es: ElasticsearchService // private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.queryText = await this.es.getKeyword() as string;
    // console.log("bar : query text", this.queryText)
  }

  updateKeyword($event) {
    this.queryText = $event.target.value;
    // console.log("bar comp : keyword accepted : " + this.queryText);
  }

  search() {
    // this.eventSvs.addSrchHst(this.queryText);
    
    this.es.setKeyword(this.queryText);
    // this.es.fullTextSearch("post_body", this.queryText); //검색 결과 창에서 새로운 검색어 입력할 때 필요.
    // this.searched.emit();
    this.auth.addSrchHst(this.queryText);
    // console.log("emitted!")
    // console.log("search bar : fulltextsearch done with " + this.queryText);
    this._router.navigateByUrl("body/search/result");
  }
}
