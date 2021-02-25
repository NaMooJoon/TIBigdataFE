import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { SocialLoginModule } from "angularx-social-login";
import { CoreModule } from "../core/core.module";
import { AuthGuard } from "../core/guards/auth-guard/auth.guard";
import { TokenInterceptorService } from "../core/interceptor/token-interceptor.service";
import { AuthenticationService } from "../core/services/authentication-service/authentication.service";
import { SharedModule } from "../shared/shared.module";
import { AboutKubicModule } from "./about-kubic/about-kubic.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ArticleAnalysisComponent } from "./article-analysis/article-analysis";
import { ArticleLibraryModule } from "./article-library/article-library.module";
import { CommunityBoardModule } from "./community-board/community.board.module";
import { HomePageComponent } from "./home-page/home-page.component";
import { MembershipModule } from "./memberships/membership.module";
import { SearchResultModule } from "./search-result/search-result.module";
import { UserpageModule } from "./userpage/userpage.module";

@NgModule({
  declarations: [AppComponent, HomePageComponent, ArticleAnalysisComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    CoreModule,
    SharedModule,
    SocialLoginModule,
    AboutKubicModule,
    ArticleLibraryModule,
    CommunityBoardModule,
    MembershipModule,
    SearchResultModule,
    UserpageModule,
  ],
  exports: [],
  providers: [AuthGuard, AuthenticationService, TokenInterceptorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
