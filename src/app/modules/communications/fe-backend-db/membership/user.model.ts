export class UserProfile {
    registerStat: logStat;
    email: string;
    name: string;
    token: string;
    password?: string;
    nickName? : String;
    // nickname? : string;
    inst?: string;
    photo?: string;
    constructor(reg, email, name, token){
        this.registerStat = reg;
        this.email = email;
        this.name = name;
        this.token = token;
    }
}

//enumerate login status
export enum logStat {
    unsigned,//0
    SUPERUSER,//1
    email,//2
    google,//3
  }