import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArticleLibraryComponent } from "./components/article-library-root/article-library.component";
import { ResearchStatusComponent } from "./components/research-status/research-status.component";
const routes: Routes = [
  {
    path: "",
    component: ArticleLibraryComponent,
  },
  {
    path: "research-status",
    component: ResearchStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule { }
