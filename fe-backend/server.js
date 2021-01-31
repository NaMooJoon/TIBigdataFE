
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const path = require('path');

const app = express();
const mongoose = require('mongoose'); //mongose 서버와 백엔드 연결 


const PORT = 14000;

const hstQry = require('./module/searchHistoryQuery');//bring the backend func and feature
const gUserQry = require('./module/googleUserQuery');
const eUserQry = require('./module/emailUserQuery');
const keepDoc = require('./module/keepMyDocQuery');
const keywords = require('./module/tfidfQuery');
const rcmds = require('./module/rcmdQuery');
const topic = require('./module/topicQuery');
const community = require('./module/communityDocsQuery');

app.use(cors());
app.use(bodyParser.json());
app.use('/gUser',gUserQry);
app.use('/eUser',eUserQry);
app.use('/hst', hstQry);//hst 경로에서 항상 require("./hst") 호출한다. use : middleware 함수.
app.use('/myDoc',keepDoc);
app.use('/keyword',keywords);
app.use('/rcmd', rcmds);
app.use('/community',community);
app.use('/topic',topic)
//root dir
app.get('/', function(req, res) {
    res.send('Hello from server');
})

//server listen with no time interval?
app.listen(PORT, function(){
    console.log('Express server running on port '+ PORT)});


