import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-route-location",
  templateUrl: "./route-location.component.html",
  styleUrls: ["./route-location.component.css"],
})
export class RouteLocationComponent implements OnInit {
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  private dir: string = "홈";

  ngOnInit(): void {
    this.dir = "홈";
    let data = this.router.url;
    let routes: Array<string> = data.split("/");

    routes.forEach((route) => {
      let routeKor = this.convertRouteIntoKor(route);
      if (routeKor != null) this.dir = this.dir + " > " + routeKor;
    });
  }

  convertRouteIntoKor(routeName: string): string {
    if (routeName === "about") return "홈페이지소개";
    if (routeName === "intro") return "사이트소개";
    if (routeName === "member-policy") return "회원정책";
    if (routeName === "collected-info") return "수집정보";
    if (routeName === "service-guide") return "서비스안내";
    if (routeName === "search") return "검색결과";
    if (routeName === "read") return "문서상세보기";
    if (routeName === "anlaysis") return "자료분석";
    if (routeName === "library") return "자료열람";
    if (routeName === "research-status") return "통일연구 동향 그래프";
    if (routeName === "community") return "커뮤니티";
    if (routeName === "qna") return "QNA"
    if (routeName === "faq") return "FAQ"
    if (routeName === "announcement") return "공지사항"
    if (routeName === "new") return "새 글 작성"
    if (routeName === "modify") return "글 수정"
    if (routeName === "analysis") return "자료분석"
    if (routeName === "userpage") return "마이페이지"
    if (routeName === "my-docs") return "내 보관함"
    if (routeName === "my-analysis") return "내 분석함"
    if (routeName === "member-info") return "회원 정보"
    if (routeName === "secession") return "회원 탈퇴"
  }
}
