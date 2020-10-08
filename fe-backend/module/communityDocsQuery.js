const express = require('express');
const router = express.Router();
const comDoc = require('../models/community');
const Res = require('../models/Res');
const templateModule = require('../test/template');
const template = templateModule.template;
const template2 = templateModule.template2;
// console.log(template)
const DOC_NUMBERS = 10;
const IS_TEST = false;

//yet useless dir
router.get('/', (req, res) => {
    res.send('communityDocQuery works!');
})
router.post('/writeNewDoc', writeNewDoc)


router.get('/loadFirstDocList', loadFirstDocList);

router.post('/loadNextDocList', loadNextDocList);

router.post('/loadPriorDocList', loadPriorDocList);
router.post('/loadDocListByPageIdx', loadDocListByPageIdx);
router.get('/getDocNum', getDocNum);

// function getNextDocId(){
//     return new Promise((r)=>{
//         comDoc.find({}).limit(1).exec((err, lastDoc)=>{
//             if(err)
//             console.log("getNextDocId error occur!");
//             else{
//                 if(lastDoc.docId == undefined)
//                     lastDoc.docId = 0;
//                 r(lastDoc.docId + 1);
//             }
//         })
//     })
// }


async function getDocNum(req, res){
    console.log("getDocNum")
    comDoc.count({}).exec((err, data)=>{
        if(err){
            console.log("getDocNum error occurs!");
        }
        else{
            console.log(data);
            res.status(200).json(new Res(true, "/getDocNum ok!",{data : data}));
        }
    })
}

async function loadDocListByPageIdx(req, res) {
    let bundle = req.body;
    let start_idx = bundle.cur_start_idx * DOC_NUMBERS;//다음 문서 리스트 idx

    comDoc.find({}).sort({docId : -1}).skip(start_idx).limit(DOC_NUMBERS).exec((err, doc_res) => {
        if (err)
            console.log("/loadPriorDocList failed");
        else {
            res.status(200).json(new Res(true, "/loadPriorDocList ok", { data: doc_res, next_start_idx: start_idx }))
            // res.json(new Res(true,"/loadFirstDocList ok",{data : doc_res, idx : cur_idx}));
        }
    })
}

async function loadFirstDocList(req, res) {
    console.log("load first page ok")
    comDoc.find({}).sort({docId : -1}).limit(DOC_NUMBERS).exec((err,data)=>{
        if(err){
            console.log("load fist doc list err")
        }
        else{
            console.log(data)
            res.status(200).json(new Res(true, "/loadFirstDocList ok", { data: data,next_start_idx: 0}))
        }
    })
}

async function loadPriorDocList(req, res) {
    let bundle = req.body;
    let start_idx = bundle.cur_start_idx - DOC_NUMBERS;//다음 문서 리스트 idx

    comDoc.find({}).sort({docId : -1}).skip(start_idx).limit(DOC_NUMBERS).exec((err, doc_res) => {
        if (err)
            console.log("/loadPriorDocList failed");
        else {
            res.status(200).json(new Res(true, "/loadPriorDocList ok", { data: doc_res, next_start_idx: start_idx }))
            // res.json(new Res(true,"/loadFirstDocList ok",{data : doc_res, idx : cur_idx}));
        }
    })
}


async function loadNextDocList(req, res) {
    let bundle = req.body;
    let start_idx = bundle.cur_start_idx + DOC_NUMBERS;//다음 문서 리스트 idx
    // console.log(start_idx)

    comDoc.find({}).sort({docId : -1}).skip(start_idx).limit(DOC_NUMBERS).exec((err, doc_res) => {
        if (err)
            console.log("/loadNextDocList failed");
        else {
            // console.log(doc_res)
            // debug(new Res(true, "/loadFirstDocList ok", { data: doc_res, idx: start_idx }))
            res.status(200).json(new Res(true, "/loadNextDocList ok", { data: doc_res, next_start_idx: start_idx }));
            // res.json(new Res(true,"/loadFirstDocList ok",{data : doc_res, idx :start_idx}));
        }
    })
}




async function writeNewDoc(req, res) {
    let bundle = req.body;
    let user = bundle.user;
    let title = bundle.title;
    let content = bundle.content;
    let time = new Date();
    let newId = bundle.docId;
    console.log("new ID : " , newId + 1);
    if(newId == undefined)
        newId = 0;

    let data = {
        user: user,
        title : title,
        content: content,
        year: time.getFullYear(),
        month: time.getMonth(),
        date: time.getDate(),
        hour: time.getHours(),
        min: time.getMinutes(),
        time: time,
        docId : newId
    }

    console.log(data)

    newComDoc = new comDoc(data);
    newComDoc.save((err, d) => {

        if (err)
            console.log("error occured! : ", err);
        else {
            res.status(200).json(new Res(true, "writeNewDoc ok"))
        }
    })
}





if (IS_TEST)
    module.exports = { writeNewDoc, loadFirstDocList, loadNextDocList, loadPriorDocList, DOC_NUMBERS };
else
    module.exports = router;
