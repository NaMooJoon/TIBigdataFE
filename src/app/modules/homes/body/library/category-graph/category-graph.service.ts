import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
    providedIn: 'root',
  })
export class ConfigService {
    constructor(private http: HttpClient) { }

    // configUrl = 'assets/special_first/data1000.json';
    configUrl = 'assets/special_first/ctgRNNResult.json';

    getConfig() : Observable<any>{
        return this.http.get(this.configUrl);
    }
}