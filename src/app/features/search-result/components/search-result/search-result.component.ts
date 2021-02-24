import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.less"],
})
export class SearchResultComponent implements OnInit {
  constructor(
    public router: Router,
    private elasticSearchService: ElasticsearchService
  ) { }
  ngOnInit() { }
}
