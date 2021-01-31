import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserpageRootComponent } from './userpage-root/userpage-root.component';
import { MyDocsComponent } from './my-docs/my-docs.component';

import { UserpageRoutingModule } from './userpage-routing.module';
import { CommonSearchBarModule } from '../shared-module/common-search-bar/common-search-bar.module';
import { MyAnalysisComponent } from './my-analysis/my-analysis.component';
import { MemberInfoComponent } from './member-info/member-info.component';
import { SecessionComponent } from './secession/secession.component';


@NgModule({
  declarations: [UserpageRootComponent, MyDocsComponent, MyAnalysisComponent, MemberInfoComponent, SecessionComponent],
  imports: [
    CommonModule,
    UserpageRoutingModule,
    CommonSearchBarModule
  ]
})
export class UserpageModule { }
