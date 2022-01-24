import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";

@Component({
  selector: 'app-keyword-analysis',
  templateUrl: './keyword-analysis.component.html',
  styleUrls: ['./keyword-analysis.component.less']
})
export class KeywordAnalysisComponent implements OnInit, OnDestroy {

  private searchSubscriber: Subscription;
  private searchKeyword: string;
  constructor(private elasticsearchService: ElasticsearchService) {
    this.searchSubscriber = this.elasticsearchService
                                .getSearchStatus()
                                .subscribe(() => {
                                  this.setSearchKeyword();
                                });
  }

  ngOnInit(): void {
    this.setSearchKeyword();
    this.getSearchHistoryFromElasticSearch();
  }

  ngOnDestroy() {
    this.searchSubscriber.unsubscribe();
  }

  setSearchKeyword() {
    this.searchKeyword = this.elasticsearchService.getKeyword();
  }

  async getSearchHistoryFromElasticSearch() {
    var current = new Date();
    var y = current.getFullYear();
    var c_month = current.getMonth() + 1;
    var month = [3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7];
    var cnt = [];
    var idx = -1;
    for(var i = 5 ; i < 17; i++){
      if(month[i] == c_month) {
        idx = i;
        break;
      }
    }
    if(idx == -1){
      console.log("IDX_ERROR");
    }
    for(var j = 0; j < 6; j ++){
      var m;
      if(month[idx] < 10){
        m = "0" + month[idx];
      }
      else {
        m = "" + month[idx];
      }
      //search_log-<year>.<month>
      var index = "search_log-" + y + "." + m;
      var count;
      try {
        count = await this.elasticsearchService.getSearchHistory(index);
        cnt.push(count["count"]);
      }
      catch (e) {
        console.log("There is no log file for year: " + y + ", month: " + m);
        cnt.push(-1);
      }


      if(month[idx] < month[idx - 1]){
              y = y - 1;
      }
      idx = idx -1;
    }
    console.log(cnt);
  }

  public get getSearchKeyword(): string {
    return this.searchKeyword;
  }

}


