const mongoose = require('mongoose');
const db = require('./config')
const userCollection = db+ 'communityBoard';

const conn = mongoose.createConnection(userCollection);

module.exports = conn;