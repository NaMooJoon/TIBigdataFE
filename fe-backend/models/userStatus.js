const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
const conn = require("../connection/userConn");

autoIncrement.initialize(conn);

const userStatusSchema = new Schema({
  userId: ObjectId,
  registeredDate: Date,
  modifiedDate: Date,
  isActive: Boolean,
  isAdmin: Boolean,
});

module.exports = conn.model("userStatus", userStatusSchema);
