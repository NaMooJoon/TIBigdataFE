class Res {
    //there is no type restriction in typescript.
    constructor(succ, msg, payload) {
        this.succ = succ;//try to be booelan //request success or fail!
        this.msg = msg;//try to be string
        this.payload = payload;//try to be object
    }
}

module.exports = Res;