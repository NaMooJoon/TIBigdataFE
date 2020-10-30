import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CommunicationModule} from '../../communications/communication.module';
// import { SearchModule } from '../../homes/body/search/search.module';
// import { SpecialsModule } from '../../homes/body/specials/specials.module';
// import { SearchBarComponent } from './search-bar/search-bar.component';
import { BodyContainerComponent } from './body-container/body-container.component';
import { BodyRoutingModule } from "./body-routing.module";
import { CommonSearchBarModule } from './shared-module/common-search-bar/common-search-bar.module';
import { CommonSearchResultDocumentListModule } from './shared-module/common-search-result-document-list/common-search-result-document-list.module'

// import { IdControlService } from './search/service/id-control-service/id-control.service';

@NgModule({
  declarations: [
    // SearchBarComponent,
  BodyContainerComponent
],
  imports: [
    CommonModule,
    // SearchModule,
    // SpecialsModule,
    // CommunicationModule,
    CommonSearchBarModule,
    BodyRoutingModule,
    CommonSearchResultDocumentListModule
  ],
  exports: [
    // SearchResultComponent,
    // SearchBarComponent
  ],
  // providers:[
  //   IdControlService
  // ]
})
export class BodyModule { }
