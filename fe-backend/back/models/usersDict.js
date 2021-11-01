const { stringify } = require("@angular/compiler/src/util");
const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
const conn = require("../connection/textMiningConn");

autoIncrement.initialize(conn);

const usersDictSchema = new Schema({
  userEmail: String,
  keyword: String,
  savedDate: String,
  stopword: Object,
  synonym: Object,
  compound: Object,
},{collection: 'usersDic'});

module.exports = conn.model("usersDict", usersDictSchema);
