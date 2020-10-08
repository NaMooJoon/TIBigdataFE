import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityRootComponent } from './community-root/community-root.component';
import { CommunityComponent } from './community/community.component';
import { WriteNewCommunityDocComponent } from './write-new-community-doc/write-new-community-doc.component';
import { ReadCommunityDocComponent } from './read-community-doc/read-community-doc.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { FAQComponent } from './faq/faq.component';
import { RequestToAdminComponent } from './request-to-admin/request-to-admin.component';


@NgModule({
  declarations: [CommunityRootComponent, CommunityComponent, WriteNewCommunityDocComponent, ReadCommunityDocComponent, AnnouncementComponent, FAQComponent, RequestToAdminComponent],
  imports: [
    CommonModule,
    CommunityRoutingModule
  ]
})
export class CommunityModule { }
