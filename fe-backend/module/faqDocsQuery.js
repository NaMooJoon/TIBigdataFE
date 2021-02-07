const express = require('express');
const moment = require('moment');
const Faq = require('../models/faq');
const router = express.Router();
const Res = require('../models/Res');
const DOC_NUMBERS = 10;

//yet useless dir
router.get('/', (req, res) => {
    res.send('faq query works!');
})
router.post('/registerDoc', registerDoc)
router.post('/getDocsNum', getDocsNum);
router.post('/getDocs', getDocs);
router.post('/deleteDoc', deleteDoc);
router.post('/modDoc', modDoc);
router.post('/getSingleDoc', getSingleDoc);

async function getDocsNum(req, res){
    Faq.countDocuments({}, function(err, count){
        if(err){
            console.log(err);
            return res.status(400).json(new Res(false, "failed to get query result.", null))
        }
        else{
            return res.status(200).json(new Res(true, "successfully get number of docs", { docNum : count }));
        }
    })
} 

async function registerDoc (req, res){
    newDoc = new Faq({
        "title" : req.body.title,
        "content" : req.body.content,
        "category" : req.body.category,
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
    Faq.find({}).sort({'docId':-1}).skip(req.body.startIndex).limit(10).exec(function(err, docList){
        if (err){
            
            return res.status(400).json(new Res(false, "failed to get docs", null));
        }
        else{
            
            return res.status(200).json(new Res(true, "successfully load docs", {'docList': docList}));
        }
    })
}

async function deleteDoc(req, res){
    Faq.remove({'docId': req.body.docId}, function(err){
        if (err){
            return res.status(400).json(new Res(false, "failed to delete docs", null));
        }
        else{
            return res.status(200).json(new Res(true, "successfully load docs", null));
        }
    });
}

async function modDoc (req, res){
    faq.updateOne(
        { 'docId': req.body.docId },
        {
            "title" : req.body.title,
            "content" : req.body.content,
            "category": req.body.category,
            "modDate" : moment().format("YYYY-MM-DD"),
        },
    function(err){
        if (err){
            console.log(err)
            return res.status(400).json(new Res(false, "failed to update doc", null));
        }
        else{
        
            return res.status(200).json(new Res(true, "successfully update doc", null));
        }
    });
}

async function getSingleDoc (req, res){
    Faq.findOne({'docId': req.body.docId}).then((result) => {
        return res.status(200).json(new Res(true, "successfully update doc", result));
    }).catch((err) => {
        console.log(err);
        return res.status(400).json(new Res(false, "failed to update doc", null));
    });
}

module.exports = router;
