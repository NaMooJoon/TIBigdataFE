export class UserProfile {
    registerStat: logStat;
    email: string;
    name: string;
    token: string;
    password?: string;
    nickName?: string;
    inst: string;
    api: boolean;
    constructor(reg, email, name, nickname, inst, api, token) {
        this.registerStat = reg;
        this.email = email;
        this.name = name;
        this.token = token;
        this.nickName = nickname;
        this.inst = inst
        this.api = api;
    }
}

//enumerate login status
export enum logStat {
    unsigned,//0
    SUPERUSER,//1
    email,//2
    google,//3
}