const mongoose = require('mongoose');
const db = require('./config')
const userCollection = db+ 'user';

const conn = mongoose.createConnection(userCollection, {useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true});

module.exports = conn;