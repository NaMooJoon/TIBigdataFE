const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const conn = require('../connection/boardConn');
autoIncrement.initialize(conn)

const faqDocSchema = new Schema({
    docId : Number,
    title : String,
    content : String,
    category: String,
})

faqDocSchema.plugin(autoIncrement.plugin, {
    model : 'faqModel',
    field : 'docId',
    startAt : 1,
    increment : 1,
})


module.exports = conn.model('faq',faqDocSchema);