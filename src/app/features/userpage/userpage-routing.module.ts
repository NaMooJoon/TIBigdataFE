import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyDocsComponent } from "./components/my-docs/my-docs.component";
import { MyAnalysisComponent } from "./components/my-analysis/my-analysis.component";
import { MemberInfoComponent } from "./components/member-info/member-info.component";
import { SecessionComponent } from "./components/secession/secession.component";
import { UserpageRootComponent } from "./components/userpage-root/userpage-root.component";

const routes: Routes = [
  {
    path: "",
    component: UserpageRootComponent,
    children: [
      {
        path: "my-docs",
        component: MyDocsComponent
      },
      {
        path: "my-analysis",
        component: MyAnalysisComponent
      },
      {
        path: "member-info",
        component: MemberInfoComponent
      },
      {
        path: "secession",
        component: SecessionComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserpageRoutingModule { }