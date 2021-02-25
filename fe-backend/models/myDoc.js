const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const keepDocSchema = new Schema({
  userEmail: String,
  savedDocIds: [],
});

// module.exports = mongoose.model('keepDoc',keepDocSchema);
// module.exports = keepDocSchema;
const conn = require("../connection/userConn");
module.exports = conn.model("myDoc", keepDocSchema);
