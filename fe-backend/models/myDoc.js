const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const keepDocSchema = new Schema({
    docID : String,
    //date that user keep this document as myDoc
    year : Number,
    month : Number,
    date : Number,
    hour : Number,
    min : Number
})  

// module.exports = mongoose.model('keepDoc',keepDocSchema);
// module.exports = keepDocSchema;
const conn = require('../connection/userConn');
module.exports = conn.model('myDoc',keepDocSchema)