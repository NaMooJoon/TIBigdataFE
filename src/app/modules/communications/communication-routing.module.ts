import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from '../homes/body/membership/register/register.component';
import { RegisterOkComponent } from '../homes/body/membership/register/register-ok/register-ok.component';
import { LoginComponent } from '../homes/body/membership/login/login.component';
import { AuthGuard } from './fe-backend-db/membership/auth.guard';
import { ControlComponent } from '../homes/body/membership/control/control.component';
import { ApiRegisterComponent } from '../homes/body/membership/register/api-register/api-register.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'register-ok',
    component: RegisterOkComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'api-register',
    component: ApiRegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'control',
    component: ControlComponent,
    canActivate: [AuthGuard],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
