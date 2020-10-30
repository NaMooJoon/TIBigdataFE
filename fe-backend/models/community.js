const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communityDocSchema = new Schema({
    user : String,
    title : String,
    content : String,
    date : Date,
    docId : Number
})

const conn = require('../connection/userConn');
module.exports = conn.model('communityDoc',communityDocSchema)