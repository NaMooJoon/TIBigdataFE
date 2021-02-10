import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FooterComponent } from './modules/homes/footer/footer.component';
import { NavComponent } from './modules/homes/nav/nav.component';
import { MainHomeContainerComponent } from './modules/homes/body/main-home-container/main-home-container.component';
// import { HomeSearchBarComponent } from './modules/homes/body/main-home-container/home-search-bar/home-search-bar.component';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { LibraryModule } from './modules/homes/body/library/library.module';
import { WordcloudService } from './modules/homes/graphs/wordcloud/wordcloud.service';
// import { SearchBarComponent } from "./modules/homes/body/search/search-bar/search-bar.component";
import { AuthService } from './modules/communications/fe-backend-db/membership/auth.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { AnalysisDatabaseService } from './modules/communications/fe-backend-db/analysis-db/analysisDatabase.service';
import { CommunicationModule } from './modules/communications/communication.module';
import { ChartsModule } from "ng2-charts";
import { BodyModule } from "./modules/homes/body/body.module";
import { CommonSearchBarModule } from "./modules/homes/body/shared-modules/search-bar/common-search-bar.module";
import { CommonSearchResultDocumentListModule } from './modules/homes/body/shared-modules/documents/documents.module';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavComponent,
    MainHomeContainerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BodyModule,
    FormsModule,
    ReactiveFormsModule,
    TagCloudModule,
    LibraryModule,
    ChartsModule,
    CommunicationModule,
    CommonSearchBarModule,
    CommonSearchResultDocumentListModule,
  ],
  exports: [
  ],
  providers: [WordcloudService, AuthService, AnalysisDatabaseService, SocialAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
