const mongoose = require("mongoose");
const db = require("./config");
const dataCollection = db + "textMining";

const conn = mongoose.createConnection(dataCollection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = conn;
