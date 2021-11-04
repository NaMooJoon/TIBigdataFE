const express = require("express");
const moment = require("moment");
const Res = require("../models/Res");
const router = express.Router();

router.post("/uploadDict", uploadDict);
router.post("/getPreprocessedData",getPreprocessedData);

const usersDict = require("../models/usersDict");
const preprocessing = require("../models/preprocessing");



async function uploadDict(req, res) {
    let userEmail = req.body.userEmail;
    let dictType = req.body.dictType;
    let csv = req.body.csv;

    // console.log('req',req);
    let doc;
    if(dictType=='synonym') doc = {'synonym':csv};
    else if(dictType=='stopword') doc = {'stopword':csv};
    else if(dictType=='compound') doc = {'compound':csv};

    usersDict.findOneAndUpdate(
        { userEmail: userEmail },
        {"$set":doc},
        { upsert: true, returnNewDocument: true }
      ).then((result=>console.log(result)));
          return res
            .status(200)
            .json(
              new Res(true, "successfully uploaded",null)
            );
  }


  async function getPreprocessedData(req, res) {
    let userEmail = req.body.userEmail;
    let savedDate = req.body.savedDate;
  
    preprocessing
      .findOne(
        { $and: [ { userEmail: userEmail }, {'savedDate' : new Date(savedDate).toISOString() } ] },
        // sort=[('processedDate', 1)]
        )
      .then((result) => {
        // console.log(result);
        // for(let i=0;i<result.tokenList.length;i++)
        // // let i=0;
        //   result.tokenList[i] = result.tokenList[i].slice(0,10);
        result.tokenList = result.tokenList[0].slice(0,10);
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
  }
  
module.exports = router;