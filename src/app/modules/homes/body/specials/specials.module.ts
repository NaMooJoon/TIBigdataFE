import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialsRoutingModule } from './specials-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpecialsRootComponent } from './specials-root/specials-root.component';
import { ChartsModule } from "ng2-charts";
import { FormsModule } from "@angular/forms";
import { TagCloudModule } from 'angular-tag-cloud-module';
import { CommonSearchBarModule } from '../shared-module/common-search-bar/common-search-bar.module';

@NgModule({
  declarations: [
    DashboardComponent,
    SpecialsRootComponent
  ],
  imports: [
    SpecialsRoutingModule,
    CommonModule,
    ChartsModule,
    FormsModule,
    TagCloudModule,
    CommonSearchBarModule
  ],
  // exports: [DashboardComponent]
})
export class SpecialsModule { }
