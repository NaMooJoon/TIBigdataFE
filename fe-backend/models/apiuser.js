const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const apiSchema = new Schema({
  app_name: String,
  app_purpose: String,
  user_email: String,
  reporting_date: String,
  expiration_date: String,
  traffic: Number,
},{collection: 'apiUser'});

const conn = require("../connection/userConn");
const ApiInfo = conn.model("apiuser", apiSchema);
module.exports = ApiInfo;
