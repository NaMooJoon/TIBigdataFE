import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityRootComponent } from './community-root/community-root.component';
import { QnaComponent } from './qna/qna.component';
import { WriteCommunityDocComponent } from './write-community-doc/write-community-doc.component';
import { ReadCommunityDocComponent } from './read-community-doc/read-community-doc.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { FAQComponent } from './faq/faq.component';
import { CommonSearchBarModule } from '../shared-modules/search-bar/common-search-bar.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommunityRootComponent,
    QnaComponent,
    WriteCommunityDocComponent,
    ReadCommunityDocComponent,
    AnnouncementComponent,
    FAQComponent,
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    CommonSearchBarModule,
    ReactiveFormsModule
  ],

})
export class CommunityModule { }
