import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-route-location",
  templateUrl: "./route-location.component.html",
  styleUrls: ["./route-location.component.css"],
})
export class RouteLocationComponent implements OnInit {

  private _dir: string = "홈";

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {
    this.dir = "홈";
    let data = this.router.url;
    let routes: Array<string> = data.split("/");

    routes.forEach((route) => {
      let routeKor = this.convertRouteIntoKor(route);
      if (routeKor != null) this.dir = this.dir + " > " + routeKor;
    });
  }

  /**
   * @description Convert route url into Korean route name.
   * @param routeName Route url parsed from router module.
   * @returns Korean route name.
   */
  convertRouteIntoKor(routeName: string): string {
    if (routeName === "about") return "홈페이지소개";
    else if (routeName === "intro") return "사이트소개";
    else if (routeName === "member-policy") return "회원정책";
    else if (routeName === "collected-info") return "수집정보";
    else if (routeName === "service-guide") return "서비스안내";
    else if (routeName === "search") return "검색결과";
    else if (routeName === "read") return "문서상세보기";
    else if (routeName === "anlaysis") return "자료분석";
    else if (routeName === "library") return "자료열람";
    else if (routeName === "research-status") return "통일연구 동향 그래프";
    else if (routeName === "community") return "커뮤니티";
    else if (routeName === "qna") return "QNA"
    else if (routeName === "faq") return "FAQ"
    else if (routeName === "announcement") return "공지사항"
    else if (routeName === "new") return "새 글 작성"
    else if (routeName === "modify") return "글 수정"
    else if (routeName === "analysis") return "자료분석"
    else if (routeName === "userpage") return "마이페이지"
    else if (routeName === "my-docs") return "내 보관함"
    else if (routeName === "my-analysis") return "내 분석함"
    else if (routeName === "member-info") return "회원 정보"
    else if (routeName === "secession") return "회원 탈퇴"
  }

  public get dir(): string {
    return this._dir;
  }
  public set dir(value: string) {
    this._dir = value;
  }
}
