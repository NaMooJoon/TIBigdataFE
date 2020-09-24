const mongoose = require('mongoose');
const db = require('./config')
const dataCollection = db+ 'analysis';


const conn = mongoose.createConnection(dataCollection);

module.exports = conn;