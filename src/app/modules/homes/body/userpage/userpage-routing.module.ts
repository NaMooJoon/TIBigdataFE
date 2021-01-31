import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserpageRootComponent } from './userpage-root/userpage-root.component'
import { MyDocsComponent } from './my-docs/my-docs.component'; 
import { MyAnalysisComponent } from './my-analysis/my-analysis.component';
import { MemberInfoComponent } from './member-info/member-info.component';
import { SecessionComponent } from './secession/secession.component';

const routes: Routes = [
  {
    path :"",
    component : UserpageRootComponent,
    children : [
        {
          path :"my-docs",
          component : MyDocsComponent
        },
        {
          path :"my-analysis",
          component : MyAnalysisComponent
        },
        {
          path :"member-info",
          component : MemberInfoComponent
        },
        {
          path :"secession",
          component : SecessionComponent
        }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserpageRoutingModule { }
