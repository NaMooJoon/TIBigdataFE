const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");
const conn = require("../connection/boardConn");

autoIncrement.initialize(conn);

const announcementDocSchema = new Schema({
  docId: Number,
  userName: String,
  userEmail: String,
  title: String,
  content: String,
  regDate: Date,
  modDate: Date,
  isMainAnnounce: Boolean,
});

announcementDocSchema.index({ title: "text", content: "text" });

announcementDocSchema.plugin(autoIncrement.plugin, {
  model: "announcementModel",
  field: "docId",
  startAt: 1,
  increment: 1,
});

module.exports = conn.model("announcement", announcementDocSchema);
