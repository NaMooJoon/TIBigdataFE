const mongoose = require('mongoose');
const db = require('./config')
const dataCollection = db+ 'analysis0919';


const conn = mongoose.createConnection(dataCollection);

module.exports = conn;
