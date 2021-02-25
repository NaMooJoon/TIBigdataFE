import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IntroComponent } from "./components/intro/intro.component";
import { ServiceGuideComponent } from "./components/service-guide/service-guide.component";
import { CollectedInfoComponent } from "./components/collected-info/collected-info.component";
import { MemberPolicyComponent } from "./components/member-policy/member-policy.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "intro",
    pathMatch: "prefix",
  },
  {
    path: "intro",
    component: IntroComponent,
  },
  {
    path: "service-guide",
    component: ServiceGuideComponent,
  },
  {
    path: "collected-info",
    component: CollectedInfoComponent,
  },
  {
    path: "member-policy",
    component: MemberPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutKubicRoutingModule {}
