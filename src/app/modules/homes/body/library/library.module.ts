import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryRoutingModule } from './library-routing.module';
import { LibraryRootComponent } from './library-root/library-root.component';
import { CategoryComponent } from './category/category.component';
// import { GraphComponent } from './graph/graph.component';
import { CatGraphComponent } from './category-graph/category-graph.component';
// import { SearchModule } from '../search/search.module';
import { CommonSearchResultDocumentListModule } from '../shared-module/common-search-result-document-list/common-search-result-document-list.module';
import { CommonSearchBarModule } from '../shared-module/common-search-bar/common-search-bar.module';

@NgModule({
  declarations: [
    LibraryRootComponent, 
    CategoryComponent, 
    // GraphComponent,
    CatGraphComponent
  ],
  imports: [
    CommonModule,
    // SearchModule,
    LibraryRoutingModule,
    CommonSearchResultDocumentListModule,
    CommonSearchBarModule
  ],
  exports:[
    LibraryRootComponent,
  ]
})
export class LibraryModule { }
