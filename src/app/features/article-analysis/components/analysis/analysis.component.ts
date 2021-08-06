import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { savedDocForAnalysis } from "../savedDocForAnalysis";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.less"],
})
export class AnalysisComponent  extends savedDocForAnalysis implements OnInit  {

  ngOnInit(): void {
    this.loadSavedDocs();
  }

  showPop(analName:string){
    document.getElementById(analName).style.display='inline';
  }

}
