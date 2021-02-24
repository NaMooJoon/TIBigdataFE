import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouteLocationComponent } from "./component/route-location/route-location.component";
import { ArticleCardViewComponent } from "./component/article-card-preview/article-card-preview.component";
import { ArticleListComponent } from "./component/article-list/article-list.component";
import { SearchBarComponent } from "./component/search-bar/search-bar.component";

@NgModule({
  declarations: [
    ArticleCardViewComponent,
    ArticleListComponent,
    SearchBarComponent,
    RouteLocationComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [
    SearchBarComponent,
    ArticleListComponent,
    ArticleCardViewComponent,
    RouteLocationComponent,
  ],
  providers: [],
  bootstrap: [],
})
export class SharedModule {}
