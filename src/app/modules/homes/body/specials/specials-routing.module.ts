
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpecialsRootComponent } from './specials-root/specials-root.component';
import { AuthGuard } from '../../../communications/fe-backend-db/membership/auth.guard';
const routes: Routes = [
  {
    path:"",
    component : SpecialsRootComponent,
    children:[
      { path: "",
        component: DashboardComponent,
        // canActivate : [AuthGuard]
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialsRoutingModule { }
