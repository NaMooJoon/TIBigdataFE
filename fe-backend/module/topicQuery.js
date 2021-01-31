

const express = require("express");
const router = express.Router();
const topic = require("../models/topic");

router.get("/", (req, res) => {
    res.send("topicQuery");
});

router.get("/test", (req, res) => {
    // console.log("work!");
    let id = "5de1134ab53863d63aa55309";
    topic.findOne({ docID: id }, (error, val) => {
        if (error) {
            console.log(error);
        }
        // console.log(val)
        res.json(val);
    });
});

router.get("/getTopicTblPlain", (req, res) => {
    topic.find({}, (err, docs) => {
        if (err)
            console.log(err);
        console.log(docs);
        res.json(docs);
    })
})

router.post("/getOneTopicDocs", (req, res) => {
    console.log("get reqeust");
    let tp = req.body.topic;
    console.log(tp);
    topic.aggregate(
        [
            {
                $match: { "topic": tp }
            },
            {
                $project: {
                    'docId': 1,
                    '_id': 0
                }
            },
        ],
        (err, docs)=>{
            if(err)
                console.log(err)
            else{
                console.log('docs', docs);
                res.json(docs);
            }   
        }
    );
    
})


function getTopicTbl(req,res){
    topic.aggregate(
        [
            {
                $group: {
                    _id: "$topic", info: { $addToSet: { docID: "$docID", name: "$docTitle", value: 10 } }
                }
            },
            {
                $project:{
                    info: 1
                }
            }
            // { $addField : {value : 1} }
        ]
        , (err, docs) => {
            /**
             * 여기서부터 아무런 반응이 없다. 도대체 왜??????????????????????????????????????????????/
             * 
             */
            if (err)
                console.log(err);
            // console.log(docs)
            res.json(docs);
        })
}

router.get("/getTopicTbl",getTopicTbl);

router.post("/getTopicTbl", (req, res) => {
    let topicReq = req.body["topic"];
    // console.log("get topic tbl init.");
    topic.aggregate(

        [
            { $match: { topic: topicReq } },
            // {$}

        ])


    // findOne({ topic: topicReq }, (err, docs) => {
    //     /**
    //      * 여기서부터 아무런 반응이 없다. 도대체 왜??????????????????????????????????????????????/
    //      * 
    //      */
    //     console.log("Work?")
    //     if (err)
    //         console.log(err);
    //     console.log(docs)
    //     res.json(docs);
    // })
})

module.exports = router;
// module.exports = {getTopicTbl,getOneTopicDocs};
