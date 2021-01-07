export class Res{
    
    succ : String;
    msg : String;
    payload : {};
    constructor(succ,msg,payload){
        this.succ = succ;
        this.msg = msg;
        this.payload = payload;
    }
}