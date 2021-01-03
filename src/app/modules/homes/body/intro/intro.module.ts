import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntroRoutingModule } from './intro-routing.module';
import { IntroRootComponent } from './intro-root/intro-root.component';
import { IntroComponent } from './intro/intro.component';
import { ServiceGuideComponent } from './service-guide/service-guide.component';
import { CollectedInfoComponent } from './collected-info/collected-info.component';
import { MemberPolicyComponent } from './member-policy/member-policy.component';


@NgModule({
  declarations: [IntroRootComponent, IntroComponent, ServiceGuideComponent, CollectedInfoComponent, MemberPolicyComponent],
  imports: [
    CommonModule,
    IntroRoutingModule
  ]
})
export class IntroModule { }
