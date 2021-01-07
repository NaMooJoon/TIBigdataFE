const express = require('express');
const router = express.Router();
const User = require('../models/user');
const KeepDoc = require('../models/myDoc');
const Res = require('../models/Res');

router.post('/getMyDoc', (req, res) => {
    // console.log("req : ", req);
    let user = req.body.payload;
    // console.log("getMyDoc response func : ", user);
    User.findOne({ email: user }, { myDoc: 1 }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(doc)
            if (!doc) {
                console.error(Error("Error in show history"))
            }
            else {
                // console.log(doc.myDoc)

                if (doc.myDoc.length == 0)//when no myDoc records
                    res.json(new Res(false, "no myDoc records"))
                else
                    res.json(new Res(true, null, doc.myDoc));
            }
        }
    })
})

router.post('/eraseAllDoc', (req, res) => {
    let user = req.body.payload;
    // console.log("Erase all my docs");
    User.deleteOne({ email: user }, (err, data) => {
        if (err) {
            console.error(err);
            res.json({ succ: false })
        }
        else {
            // console.log("erase done for user", user);
            res.json({ succ: true })

        }
    })
})

router.post('/keepMyDoc', (req, res) => {
    // console.log("keep Doc init");
    let data = req.body;
    let userEmail = data.userEmail;
    let docs = data.docs
    // console.log("user : ", userEmail, ", doc ids : ", docs);
    var userDocs;
    User.findOneAndUpdate({ email: userEmail }, { $push: { myDoc: docs } }, (err, doc) => {
        if (err) {
            console.err(err);
        }
        else {
            if (!doc) {
                console.log("doc not found")
                // console.log(doc);
                res.status(401).send({ add: false });
            }
            else {
                // console.log("doc found!")
                // console.log(doc);
                userDocs = doc.myDoc;
                userDocs.push(docs);
                // console.log(userDocs);
                res.json({ myDoc: userDocs });
            }
        }
    })
})

module.exports = router;