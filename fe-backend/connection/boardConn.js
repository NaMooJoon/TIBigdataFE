const mongoose = require("mongoose");
const db = require("./config");
const communityBoardCollection = db + "communityBoard";

const conn = mongoose.createConnection(communityBoardCollection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = conn;
