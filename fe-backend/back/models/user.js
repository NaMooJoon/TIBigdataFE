const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  inst: String,
  email: String,
  status: String,
  isAdmin: Boolean,
  isApiUser: Boolean,
});

const conn = require("../connection/userConn");
const User = conn.model("user", userSchema);
module.exports = User;
