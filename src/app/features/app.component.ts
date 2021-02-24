import { Component } from "@angular/core";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  title = "KUBiC";

  private isUserLoaded = false;
  private isBackendAvailable;
  private isSearchbarNeeded = true;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private elasticsearchSearvice: ElasticsearchService
  ) {
    this.isUserLoaded = false;
    this.isBackendAvailable = null;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        try {
          let rootUrl = this.router.url.split("/")[1];

          if (rootUrl === "login" || rootUrl === "register" || rootUrl === "register-ok" || rootUrl === "")
            this.isSearchbarNeeded = false;
          else this.isSearchbarNeeded = true;
        } catch (error) {
          this.isSearchbarNeeded = false;
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.isBackendAvailable = await this.elasticsearchSearvice.isAvailable();
    let isSuccess = await this.authenticationService.verifySignIn();
    if (!isSuccess) {
      this.isUserLoaded = false;
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      this.authenticationService.signOut();
      this.router.navigate(["/"]);
    }
    this.isUserLoaded = true;
  }
}
