const express = require("express");
const router = express.Router();
const myDoc = require("../models/myDoc");
const Res = require("../models/Res");

router.post("/getMyDoc", (req, res) => {
  let userEmail = req.body.userEmail;
  myDoc
    .findOne({ userEmail: userEmail }, { savedDocIds: 1, _id: 0 })
    .then((result) => {
      if (result)
        return res
          .status(200)
          .json(
            new Res(true, "successfully saved doc ids", {
              docIds: result.savedDocIds,
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
  myDoc
    .deleteOne({ userEmail: userEmail })
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

router.post("/saveMyDoc", (req, res) => {
  let userEmail = req.body.userEmail;
  let docIds = req.body.docIds;

  myDoc
    .findOneAndUpdate(
      { userEmail: userEmail },
      { $addToSet: { savedDocIds: { $each: docIds } } },
      { upsert: true }
    )
    .then((result) => {
      return res.status(200).json(new Res(true, "successfully saved doc ids"));
    })
    .catch((err) => {
      return res.status(400).json(new Res(false, "Failed to saved doc ids"));
    });
});

module.exports = router;
