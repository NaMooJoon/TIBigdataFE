import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReadArticle } from "./components/read-article/read-article.component";
import { SearchResultComponent } from "./components/search-result/search-result.component";
const routes: Routes = [
  { path: "", redirectTo: "result", pathMatch: "prefix" },
  {
    path: "result",
    component: SearchResultComponent,
  },
  {
    path: "read",
    component: ReadArticle,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule { }
