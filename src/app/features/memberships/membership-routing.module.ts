import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth-guard/auth.guard";
import { ApiRegisterComponent } from "./components/api-register/api-register.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterOkComponent } from "./components/register-ok/register-ok.component";
import { RegisterComponent } from "./components/register/register.component";

const routes: Routes = [
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "register-ok",
    component: RegisterOkComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "api-register",
    component: ApiRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicationRoutingModule { }
