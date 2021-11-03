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
            new Res(true, "successfully saved doc HashKeys", result)
          );
      else{
        return res
        .status(200)
        .json(
          new Res(false, "no saved docs", [])
        );
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json(new Res(false, "successfully saved doc HashKeys", null));
    });
});

router.post("/getAllMyDoc", (req, res) => {
  let userEmail = req.body.userEmail;

  myDoc
    .findOne({ userEmail: userEmail })
    .then((result) => {
      if (result)
        return res
          .status(200)
          .json(
            new Res(true, "successfully saved doc HashKeys", {
              keywordList : result.keywordList,
            })
          );
      else{
        return res
        .status(200)
        .json(
          new Res(false, "no saved docs", {
            docHashKeys: [],
          })
        );
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(400)
        .json(new Res(false, "successfully saved doc HashKeys", null));
    });
});

router.post("/setPreprocessed", (req, res) => {
  let userEmail = req.body.userEmail;
  let savedDate = req.body.savedDate;

  myDoc
    .updateOne(
      { $and: [ { userEmail: userEmail }, {'keywordList.savedDate' : new Date(savedDate).toISOString() } ] },
      { $set: {"keywordList.$.preprocessed": true} },
  ).then((result) => {
    return res
      .status(200)
      .json(new Res(true, "set Preprocessed", null));
  })
  .catch((err) => {
    return res
      .status(400)
      .json(new Res(false, "Error", null));
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
  let docHashKeys = req.body.docHashKeys;
  let savedDate = req.body.savedDate;

  console.log(docHashKeys);

  myDoc
    .findOneAndUpdate(
      { userEmail: userEmail, 'keywordList.savedDate' : new Date(savedDate).toISOString() },
      { $pull : {'keywordList.$.savedDocHashKeys' :  {$in :docHashKeys }}  },
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

router.post("/changeTitleMyDocs", (req, res) => {
  let userEmail = req.body.userEmail;
  let keyword = req.body.keyword;
  let savedDate = req.body.savedDate;

  myDoc
    .update(
      { userEmail: "sujinyang@handong.edu", 'keywordList.savedDate' : new Date(savedDate).toISOString() },
      {$set : {'keywordList.$.keyword' : keyword } }
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
  let docHashKeys = req.body.docHashKeys;
  let keyword = req.body.keyword;

  myDoc
    .findOneAndUpdate(
      { userEmail: userEmail },
      { $addToSet : { keywordList : [ { keyword : keyword, savedDate : new Date(), savedDocHashKeys : docHashKeys } ] } },
      { upsert: true }
    )
    .then((result) => {
      return res.status(200).json(new Res(true, "successfully saved doc HashKeys"));
    })
    .catch((err) => {
      return res.status(400).json(new Res(false, "Failed to saved doc HashKeys"));
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
        .json(new Res(false, "successfully saved doc HashKeys", null));
    });
});

module.exports = router;
