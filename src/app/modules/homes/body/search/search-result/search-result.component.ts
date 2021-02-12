import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.less"]
})
export class SearchResultComponent implements OnInit {
  public relatedKeywords = [];
  constructor(
    public router: Router,
    private elasticSearchService: ElasticsearchService,
  ) {
  }
  ngOnInit() {

  }

  setRelatedKeywords(keys: string[]) {
    this.relatedKeywords = keys;
  }

  async freqAnalysis() {
    this.router.navigateByUrl("search/freqAnalysis");
  }

  relatedSearch(keyword: string) {
    this.elasticSearchService.searchKeyword(keyword);
  }
}
