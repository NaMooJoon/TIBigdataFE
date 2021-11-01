const express = require("express");
const moment = require("moment");
const usersDict = require("../models/usersDict");
// const UserStatus = require("../models/userStatus");
const Res = require("../models/Res");

const router = express.Router();

// router.post("/verifyUser", verifyUser);
// router.post("/registerUser", registerUser);
router.post("/uploadDict", uploadDict);
// router.post("/verifyToken", verifyToken);
// router.post("/deleteUser", deleteUser);

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

  
module.exports = router;