import { UserProfile, logStat } from './user.model';
import { Auth } from "./userAuth.model";
import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { IpService } from 'src/app/ip.service';
import { DocumentService } from "../../../homes/body/search/service/document/document.service";

class storeToken {
    type: logStat;
    token: string;

    constructor(type: logStat, token: string) {
        this.type = type;
        this.token = token
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthEmailService extends Auth {

    protected URL = this.ipService.getFrontDBServerIp();
    protected user: UserProfile;
    private EMAIL_REG_URL = this.URL + "/eUser/register"; //mongoDB
    private EMAIL_LOGIN_URL = this.URL + "/eUser/login";
    private EMAIL_VERIFY_TOKEN = this.URL + "/eUser/verify";
    private EMAIL_CHECK_OUR_USER_URL = this.URL + "/eUser/eCheckUser";
    constructor(
        protected ipService: IpService,
        http: HttpClient,
        router: Router,
        private docSvc: DocumentService,
    ) {
        super(router, http);
    }

    /***
     * @EmailUserLoginFunctinos
     * @description email login functions
     *  functions:
     */
    getProfile(user: any) {
        console.log("getProfile from eamil auth : ", this.user)
        return this.user;
        // throw new Error("Method not implemented.");
    }

    /**
    * @function getInstance()
    * @returns email auth 인스턴스를 반환. 싱글턴 패턴 사용.
    */
    getInstance() {
        return this;
    }

    /**
     * @description Register new user. This method checks if there is existing user id in our db first, and then insert new user information only when there is no duplicated email address
     * @param user user information passed from registeration form
     */
    async register(user): Promise<any> {
        /* call http request with email address to check db. */
        let isOurUser = await super.postIsOurUser(user, this.EMAIL_CHECK_OUR_USER_URL);

        if (isOurUser.succ) {
            alert("이미 등록되어 있는 id 입니다. 로그인 페이지로 이동합니다.");
            this.router.navigateByUrl("/login");
        }
        else {
            /* call http request with user information to register new user */
            let res = await this.http.post<any>(this.EMAIL_REG_URL, user).toPromise();
            return res.succ;
        }
    }

    /**
     * @description login user with given user information. This method first check if there is a userdata correspond to given email in our db. If there is no data, ask user to register first. Otherwise, send post request to login server and get response with token and login information.
     * @param user user input information : id and password
     * @returns 
     */
    async logIn(user) {
        /* Check if there is an email registered in our DB */
        let isOurUser = await super.postIsOurUser(user, this.EMAIL_CHECK_OUR_USER_URL);
        if (!isOurUser.succ) {
            alert("아직 KUBiC 회원이 아니시군요? 회원가입 해주세요! :)");
            this.router.navigateByUrl("/register");
        }
        else {
            let res = await this.http.post<any>(this.EMAIL_LOGIN_URL, user).toPromise();
            if (res.succ) {
                alert("돌아오신 걸 환영합니다, " + res.payload.name + "님. 홈ddddd 화면으로 이동합니다.");
                localStorage.setItem('token', JSON.stringify(new storeToken(logStat.email, res.payload.token)));
                //reg, email, name, nickname, inst, token)
                console.log(res.payload.email + "\n" + res.payload.name + "\n" + res.payload.nickname + "\n" + res.payload.inst + "\n" + res.payload.inst + "\n" + res.payload.token + "\n");
                this.user = new UserProfile(logStat.email, res.payload.email, res.payload.name, res.payload.nickname, res.payload.inst, res.payload.api, res.payload.token);
            }
            else if (!res.succ) {
                alert("이메일 혹은 비밀번호가 잘못되었어요.");
                return;
            }
            err => {
                console.log(err)
            }
        }
    }

    logOut(): void {
        localStorage.removeItem("token");
    }

    async verifyToken(token): Promise<any> {
        return await this.http.post<any>(this.EMAIL_VERIFY_TOKEN, token).toPromise();
    }


}