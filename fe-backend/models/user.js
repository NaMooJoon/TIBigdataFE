
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickName : String,
    auth : String,//google, email, ...
    name : String,
    status: String,
    inst : String,//institution
    email:String,
    password: String,//use only with email
    api : Boolean,
    history : [],
    myDoc : []
})

const conn = require('../connection/userConn');
const User = conn.model('user', userSchema)
module.exports = User;