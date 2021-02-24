const express = require("express");
const moment = require("moment");
const Qna = require("../models/qna");
const router = express.Router();
const Res = require("../models/Res");
const DOC_NUMBERS = 10;

//yet useless dir
router.get("/", (req, res) => {
  res.send("qna query works!");
});
router.post("/registerDoc", registerDoc);
router.post("/getDocsNum", getDocsNum);
router.post("/getDocs", getDocs);
router.post("/deleteDoc", deleteDoc);
router.post("/modDoc", modDoc);
router.post("/modReply", modReply);
router.post("/registerReply", registerReply);
router.post("/getSingleDoc", getSingleDoc);
router.post("/deleteReply", deleteReply);
router.post("/searchDocs", searchDocs);
router.post("/searchDocsNum", searchDocsNum);

async function getDocsNum(req, res) {
  Qna.countDocuments({}, function (err, count) {
    if (err) {
      return res
        .status(400)
        .json(new Res(false, "failed to get query result.", null));
    } else {
      return res
        .status(200)
        .json(
          new Res(true, "successfully get number of docs", { docNum: count })
        );
    }
  });
}

async function registerDoc(req, res) {
  newDoc = new Qna({
    title: req.body.title,
    content: req.body.content,
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    regDate: moment().format("YYYY-MM-DD"),
    modDate: moment().format("YYYY-MM-DD"),
  });

  newDoc.save(function (err) {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json(new Res(false, "failed to get query result.", null));
    } else {
      return res
        .status(200)
        .json(new Res(true, "successfully register new doc", null));
    }
  });
}

async function getDocs(req, res) {
  if (req.body.startIndex < 0) req.body.startIndex = 0;
  Qna.find({})
    .sort({ status: 1 })
    .sort({ docId: -1 })
    .skip(req.body.startIndex)
    .limit(10)
    .exec(function (err, docList) {
      if (err) {
        return res.status(400).json(new Res(false, "failed to get docs", null));
      } else {
        return res
          .status(200)
          .json(new Res(true, "successfully load docs", { docList: docList }));
      }
    });
}
async function deleteDoc(req, res) {
  console.log(req);
  console.log(req.body.docId);
  Qna.remove({ docId: req.body.docId }, function (err) {
    if (err) {
      return res
        .status(400)
        .json(new Res(false, "failed to delete docs", null));
    } else {
      return res
        .status(200)
        .json(new Res(true, "successfully load docs", null));
    }
  });
}

async function modDoc(req, res) {
  Qna.updateOne(
    { docId: req.body.docId },
    {
      title: req.body.title,
      content: req.body.content,
      modDate: moment().format("YYYY-MM-DD"),
    },
    function (err) {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json(new Res(false, "failed to update doc", null));
      } else {
        return res
          .status(200)
          .json(new Res(true, "successfully update doc", null));
      }
    }
  );
}

async function registerReply(req, res) {
  Qna.updateOne(
    { docId: req.body.docId },
    {
      $set: {
        reply: {
          title: req.body.reply.title,
          content: req.body.reply.content,
          userName: req.body.reply.userName,
          userEmail: req.body.reply.userEmail,
          regDate: moment().format("YYYY-MM-DD"),
          modDate: moment().format("YYYY-MM-DD"),
        },
      },
    }
  )
    .then((result) => {
      return res
        .status(200)
        .json(new Res(true, "successfully update doc", null));
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(new Res(false, "failed to update doc", null));
    });
}

async function modReply(req, res) {
  Qna.updateOne(
    { docId: req.body.docId },
    {
      reply: {
        title: req.body.reply.title,
        content: req.body.reply.content,
        userName: req.body.reply.userName,
        userEmail: req.body.reply.userEmail,
        regDate: moment().format("YYYY-MM-DD"),
        modDate: moment().format("YYYY-MM-DD"),
      },
    }
  )
    .then((result) => {
      return res
        .status(200)
        .json(new Res(true, "successfully update doc", null));
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(new Res(false, "failed to update doc", null));
    });
}

async function deleteReply(req, res) {
  Qna.updateOne(
    { docId: req.body.docId },
    { $unset: { reply: 1 } },
    { multi: true }
  )
    .then((result) => {
      return res
        .status(200)
        .json(new Res(true, "successfully update doc", null));
    })
    .catch((err) => {
      return res.status(400).json(new Res(false, "failed to update doc", null));
    });
}

async function getSingleDoc(req, res) {
  Qna.findOne({ docId: req.body.docId })
    .then((result) => {
      return res
        .status(200)
        .json(new Res(true, "successfully update doc", result));
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(new Res(false, "failed to update doc", null));
    });
}

async function searchDocs(req, res) {
  Qna.createIndexes({ title: "text", content: "text" });
  Qna.find({ $text: { $search: req.body.searchText } })
    .limit(10)
    .then((result) => {
      return res
        .status(200)
        .json(new Res(true, "successfully search doc", { docList: result }));
    })
    .catch((err) => {
      return res.status(200).json(new Res(true, "failed to search doc", null));
    });
}

async function searchDocsNum(req, res) {
  Qna.createIndexes({ title: "text", content: "text" });
  Qna.find({ $text: { $search: req.body.searchText } })
    .count()
    .then((count) => {
      return res
        .status(200)
        .json(new Res(true, "successfully search doc", { docNum: count }));
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json(new Res(true, "failed to search doc", null));
    });
}

module.exports = router;
