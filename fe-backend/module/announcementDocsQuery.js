const express = require('express');
const moment = require('moment');
const Announcement = require('../models/announcement');
const router = express.Router();
const Res = require('../models/Res');
const DOC_NUMBERS = 10;

//yet useless dir
router.get('/', (req, res) => {
    res.send('announcement query works!');
})
router.post('/registerDoc', registerDoc);
router.post('/getDocsNum', getDocsNum);
router.post('/getDocs', getDocs);
router.post('/getMainAnnounceDocs', getMainAnnounceDocs);
router.post('/deleteDoc', deleteDoc);


async function getDocsNum(req, res){
    Announcement.count({}, function(err, count){
        if(err){
            return res.status(400).json(new Res(false, "failed to get query result.", null))
        }
        else{
            return res.status(200).json(new Res(true, "successfully get number of docs", { data : count }));
        }
    })
} 

async function registerDoc (req, res){
    newDoc = new Announcement({
        "title" : req.body.title,
        "content" : req.body.content,
        "userName" : req.body.userName,
        "userEmail" : req.body.userEmail,
        "isMainAnnounce": req.body.isMainAnnounce,
        "regDate" : moment().format('YYYY-MM-DD'),
        "modDate" : moment().format("YYYY-MM-DD"),
    });

    newDoc.save(function(err){
        if (err) {
            console.log(err);
            return res.status(400).json(new Res(false, "failed to get query result.", null));
        }
        else{
            return res.status(200).json(new Res(true, "successfully register new doc", null));
        }
    });
}

async function getDocs(req, res){
    if (req.body.startIndex < 0) req.body.startIndex = 0;
    Announcement.find({}).sort({'docId':-1}).skip(req.body.startIndex).limit(10).exec(function(err, docList){
        if (err){
            return res.status(400).json(new Res(false, "failed to get docs", null));
        }
        else{
            return res.status(200).json(new Res(true, "successfully load docs", {data: docList}));
        }
    })
}

async function getMainAnnounceDocs(req, res){
    if (req.body.startIndex < 0) req.body.startIndex = 0;
    Announcement.find({isMainAnnounce: true}).sort({'docId':-1}).limit(5).exec(function(err, docList){
        if (err){
            return res.status(400).json(new Res(false, "failed to get docs", null));
        }
        else{
            return res.status(200).json(new Res(true, "successfully load docs", {data: docList}));
        }
    })
}

async function deleteDoc(req, res){
    console.log(req);
    console.log(req.body.docId);
    Announcement.remove({'docId': req.body.docId}, function(err){
        if (err){
            return res.status(400).json(new Res(false, "failed to delete docs", null));
        }
        else{
            return res.status(200).json(new Res(true, "successfully load docs", null));
        }
    });
}

module.exports = router;
