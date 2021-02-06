const mongoose = require('mongoose');
const db = require('./config')
const communityBoardCollection = db + 'communityBoard';

const conn = mongoose.createConnection(communityBoardCollection);

module.exports = conn;