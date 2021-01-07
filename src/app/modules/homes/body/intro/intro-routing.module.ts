import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroRootComponent } from './intro-root/intro-root.component';
import { IntroComponent } from './intro/intro.component';
import { ServiceGuideComponent } from './service-guide/service-guide.component'
import { CollectedInfoComponent } from './collected-info/collected-info.component'
import { MemberPolicyComponent } from './member-policy/member-policy.component'

const routes: Routes = [
  {
    path :"",
    component : IntroRootComponent,
    children : [
      {
        path :"intro",
        component : IntroComponent
      },
      {
        path :"service-guide",
        component : ServiceGuideComponent
      },
      {
        path :"collected-info",
        component : CollectedInfoComponent
      },
      {
        path :"member-policy",
        component : MemberPolicyComponent
      } 
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntroRoutingModule { }
