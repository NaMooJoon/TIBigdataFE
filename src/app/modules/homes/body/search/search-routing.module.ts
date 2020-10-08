import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SearchResultComponent } from "./search-result/search-result.component";
import { FreqAnalysisComponent } from "./freq-analysis/freq-analysis.component";
import { ChosenDocAnalysisComponent } from "./search-detail/chosen-doc-analysis/chosen-doc-analysis.component";
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
        path: "ChosenDocAnalysis",
        component: ChosenDocAnalysisComponent
      },
      {
        path:"DocDetail",
        component : SearchDetailComponent
      }
    ]
  }
  // {
  //   path: "homes/searchResult",
  //   component: SearchResultComponent,

  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
