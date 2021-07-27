const express = require("express");
const router = express.Router();
const myDoc = require("../models/myDoc");
const Res = require("../models/Res");

router.post("/getMyDoc", (req, res) => {
  let userEmail = req.body.userEmail;
  let savedDate = req.body.savedDate;

  myDoc
    .findOne(
      { $and: [ { userEmail: userEmail }, {'keywordList.savedDate' : new Date(savedDate).toISOString() } ] },
      { 'keywordList.$' :1, _id: 0 }
      )
    .then((result) => {
      if (result)
        return res
          .status(200)
          .json(
            new Res(true, "successfully saved doc ids", {
              keywordList : result.keywordList,
            })
          );
      else{
        return res
        .status(200)
        .json(
          new Res(false, "no saved docs", {
            docIds: [],
          })
        );
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json(new Res(false, "successfully saved doc ids", null));
    });
});

router.post("/deleteAllMyDocs", (req, res) => {
  let userEmail = req.body.userEmail;
  let savedDate = req.body.savedDate;

  myDoc
    .findOneAndUpdate(
      {userEmail: userEmail},
      { $pull : {keywordList : {savedDate : new Date(savedDate).toISOString()}} },
      { upsert: true }
      )
    .then((result) => {
      return res
        .status(200)
        .json(new Res(true, "successfully delete all docs", null));
    })
    .catch((err) => {
      return res
        .status(400)
        .json(new Res(false, "successfully delete all docs", null));
    });
});

router.post("/deleteSelectedMyDocs", (req, res) => {
  let userEmail = req.body.userEmail;
  let docIds = req.body.docIds;
  let savedDate = req.body.savedDate;
console.log("hihi : "+docIds)
  myDoc
    .findOneAndUpdate(
      { userEmail: userEmail, 'keywordList.savedDate' : new Date(savedDate).toISOString() },
      { $pull: { 'keywordList.savedDocIds' : {$each : docIds} } },
      { upsert: true }
    )
    .then((result) => {
      return res.
      status(200)
        .json(new Res(true, "successfully delete all docs", null));
    })
    .catch((err) => {
      return res.status(400)
        .json(new Res(false, "successfully delete all docs", null));
    });
});

router.post("/saveMyDoc", (req, res) => {
  let userEmail = req.body.userEmail;
  let docIds = req.body.docIds;
  let keyword = req.body.keyword;

  myDoc
    .findOneAndUpdate(
      { userEmail: userEmail },
      { $addToSet : { keywordList : [ { keyword : keyword, savedDate : new Date(), savedDocIds : docIds } ] } },
      { upsert: true }
    )
    .then((result) => {
      return res.status(200).json(new Res(true, "successfully saved doc ids"));
    })
    .catch((err) => {
      return res.status(400).json(new Res(false, "Failed to saved doc ids"));
    });
});

//keywords
router.post("/getMyKeyword", (req, res) => {
  let userEmail = req.body.userEmail;

  myDoc
    .findOne({userEmail : userEmail},{ 'keywordList.keyword' : 1 , 'keywordList.savedDate' :1, _id: 0 })
    .then((result) => {
      if (result)
        return res
          .status(200)
          .json(
            new Res(true, "successfully saved keyword", {
              keywordList: result.keywordList,
            })
          );
      else{
        return res
          .status(200)
          .json(
            new Res(false, "no saved keyword", {
              keywordList: [],
            })
          );
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json(new Res(false, "successfully saved doc ids", null));
    });
});

module.exports = router;
