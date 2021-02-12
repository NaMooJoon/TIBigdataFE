import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchResultComponent } from "./search-result/search-result.component";
import { FreqAnalysisComponent } from "./freq-analysis/freq-analysis.component";
import { SearchRootComponent } from "./search-root/search-root.component";
import { SearchDetailComponent } from "./search-detail/search-detail.component";
const routes: Routes = [
  {
    path: "",
    component: SearchRootComponent,
    children: [
      {
        path: "result",
        component: SearchResultComponent
      },
      {
        path: "freqAnalysis",
        component: FreqAnalysisComponent
      },
      {
        path: "DocDetail",
        component: SearchDetailComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
