export class Res {
    succ: boolean;
    msg: string;
    payload: {};
    constructor(succ, msg, payload) {
        this.succ = succ;
        this.msg = msg;
        this.payload = payload;
    }
}