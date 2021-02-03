const express = require('express');
const moment = require('moment');
const Announcement = require('../models/announcement');
const router = express.Router();
const announcementDocs = require('../models/announcement');
const Res = require('../models/Res');
const DOC_NUMBERS = 10;

//yet useless dir
router.get('/', (req, res) => {
    res.send('announcement query works!');
})
router.post('/registerDoc', registerDoc)
router.get('/getDocsNum', getDocsNum);


async function getDocsNum(req, res){
    announcementDocs.count({}, function(err, count){
        if(err){
            return res.status(400).json(new Res(false, "failed to get query result.", null))
        }
        else{
            return res.status(200).json(new Res(true, "successfully get number of docs", { data : count }));
        }
    })
} 


async function registerDoc (req, res){
    console.log(req);
    let data = {
        "docId" : req.body.title,
        "content" : req.body.content,
        "userName" : req.body.userName,
        "userEmail" : req.body.userEmail,
        "regDate" : moment().format("YYYY-MM-DD HH:mm:ss"),
        "modDate" : moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    newDoc = new Announcement(data);

    newDoc.save(function(err){
        if (err) {
            return res.status(400).json(new Res(false, "failed to get query result.", null))
        }
        else{
            return res.status(200).json(new Res(true, "successfully register new doc", null));
        }
    })
}


module.exports = router;
