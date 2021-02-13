import { Component } from "@angular/core";
import { ElasticsearchService } from "./modules/communications/elasticsearch-service/elasticsearch.service";
import { AuthService } from "./modules/communications/fe-backend-db/membership/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent {
  title = "KUBiC";
  private isUserLoaded = false;
  private isBackendAvailable;

  constructor(
    private authService: AuthService,
    private elasticsearchSearvice: ElasticsearchService
  ) {
    this.isUserLoaded = false;
    this.isBackendAvailable = null;
  }

  async ngOnInit(): Promise<void> {
    this.isBackendAvailable = await this.elasticsearchSearvice.isAvailable();
    await this.authService.verifySignIn();
    this.isUserLoaded = true;
  }
}
