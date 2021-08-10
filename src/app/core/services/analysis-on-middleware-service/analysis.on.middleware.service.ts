import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IpService } from "src/app/core/services/ip-service/ip.service";
import { QueryResponse } from "../../models/query.response.model";
import { ArticleService } from "../article-service/article.service";

@Injectable({
    providedIn: "root",
})

export class AnalysisOnMiddlewareService {
    private URL = this.ipService.getMiddlewareServerIp();

    constructor(
        private ipService: IpService,
        private http: HttpClient,
        private docControl: ArticleService
        ) {}


    async postDataToMiddleware(route:string, data: string): Promise<any> {
        
        // this.http.DefaultRequestHeaders.Add("Accept", "application/json");
        // this.http.DefaultRequestHeaders.Add("Content-Type", "application/json");
        // const headers = new HttpHeaders().set('Content-Type', 'application/json');
        let res: any = await this.http
            .post<any>(this.URL+route, data, {'headers':{'Content-Type': 'application/json'}})
            .toPromise();

            if(res == undefined) alert('내부적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요!');

        return res;
    }
}