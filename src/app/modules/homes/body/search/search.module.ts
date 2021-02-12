import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { SearchRoutingModule } from './search-routing.module';
import { FreqAnalysisComponent } from './freq-analysis/freq-analysis.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchResultFilterComponent } from './search-result/search-result-filter/search-result-filter.component';
import { SearchRootComponent } from './search-root/search-root.component';
import { SearchDetailComponent } from './search-detail/search-detail.component';
import { CommonSearchBarModule } from '../shared-modules/search-bar/common-search-bar.module';
import { CommonSearchResultDocumentListModule } from '../shared-modules/documents/documents.module';

@NgModule({
  declarations: [
    SearchResultComponent,
    SearchResultFilterComponent,
    FreqAnalysisComponent,
    SearchRootComponent,
    SearchDetailComponent,
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    FormsModule,
    TagCloudModule,
    CommonSearchBarModule,
    CommonSearchResultDocumentListModule

  ],
})
export class SearchModule { }
