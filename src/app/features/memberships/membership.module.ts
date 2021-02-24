import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { CommunicationRoutingModule } from "./membership-routing.module";
import { AuthGuard } from "src/app/core/guards/auth-guard/auth.guard";
import { ElasticSearchQueryModel } from "src/app/core/models/elasticsearch.service.query.model";
import { CommunityPrivacyMaskingService } from "../community-board/services/community-privacy-masking-service/community-privacy-masking.service";
import { ApiRegisterComponent } from "./components/api-register/api-register.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterOkComponent } from "./components/register-ok/register-ok.component";
import { RegisterComponent } from "./components/register/register.component";
import { CoreModule } from "src/app/core/core.module";

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterOkComponent,
    ApiRegisterComponent,
    LoginComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    CommunicationRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
    CoreModule,
  ],
  providers: [],
})
export class MembershipModule { }
