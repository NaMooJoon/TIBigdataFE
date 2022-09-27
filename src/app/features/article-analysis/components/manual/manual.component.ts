import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-manual",
  templateUrl: "./manual.component.html",
  styleUrls: ["../../analysis-style.less"],
})
export class ManualComponent{
  constructor(public router: Router) {}

  toPreprocessing() {
    this.router.navigateByUrl("/analysis-menu/preprocessing");
}

}
