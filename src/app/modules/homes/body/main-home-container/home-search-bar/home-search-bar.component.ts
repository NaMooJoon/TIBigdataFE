import { Component, OnInit } from '@angular/core';
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { Router } from '@angular/router';
// import { ArticleSource } from '../../search/article/article.interface';


@Component({
  selector: 'app-home-search-bar',
  templateUrl: './home-search-bar.component.html',
  styleUrls: ['./home-search-bar.component.less']
})
export class HomeSearchBarComponent implements OnInit {

  // private static readonly INDEX = 'nkdboard';
  // private static readonly TYPE = 'nkdboard';

  // private queryText = '';
 
  // private lastKeypress = 0;

  // articleSources: ArticleSource[];

  constructor() {
    // this.queryText='';
   }

  ngOnInit() {
    
  }


  // onKey($event){
  //   this.queryText=$event.target.value;
  // }
  // sendResult(){
  //   // this.es.fillSubscrb(this.articleSources);
  //   this.es.setKeyword(this.queryText);
  //   this.toResultPage();
  // }

  // toResultPage(){
  //   this._router.navigateByUrl("search");
  // }


}
