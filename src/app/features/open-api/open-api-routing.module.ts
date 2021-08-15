import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ManagementComponent } from "./components/management/management.component";
import { DocumentComponent } from "./components/document/document.component";
import { GotoapiComponent } from "./components/gotoapi/gotoapi.component";
import { RegisterComponent } from "./components/register/register.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "management",
    pathMatch: "prefix",
  },
  {
    path: "management",
    component: ManagementComponent,
  },
  {
    path: "document",
    component: DocumentComponent,
  },
  {
    path: "gotoapi",
    component: GotoapiComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenApiRoutingModule {}
