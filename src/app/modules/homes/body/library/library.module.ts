import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LibraryRoutingModule } from "./library-routing.module";
import { LibraryRootComponent } from "./library-root/library-root.component";
import { CategoryComponent } from "./category/category.component";
// import { GraphComponent } from './graph/graph.component';
import { CatGraphComponent } from "./category-graph/category-graph.component";
// import { SearchModule } from '../search/search.module';
import { CommonSearchResultDocumentListModule } from "../shared-modules/documents/documents.module";
import { CommonSearchBarModule } from "../shared-modules/search-bar/common-search-bar.module";
import { ChartsModule } from "ng2-charts";

@NgModule({
  declarations: [LibraryRootComponent, CategoryComponent, CatGraphComponent],
  imports: [
    CommonModule,
    ChartsModule,
    LibraryRoutingModule,
    CommonSearchResultDocumentListModule,
    CommonSearchBarModule,
  ],
  exports: [LibraryRootComponent],
})
export class LibraryModule {}
