const express = require("express");
const moment = require("moment");
const User = require("../models/user");
const UserStatus = require("../models/userStatus");
const Res = require("../models/Res");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

router.post("/verifyUser", verifyUser);
router.post("/registerUser", registerUser);
router.post("/getUserInfo", getUserInfo);
router.post("/verifyToken", verifyToken);
router.post("/deleteUser", deleteUser);

function verifyToken(req, res) {
  var token = req.body.token;
  var CLIENT_ID = req.body.client;

  const client = new OAuth2Client(CLIENT_ID);
  console.log(CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log(payload);
    User.findOne({ email: payload.email }, (error, user) => {
      if (error) {
        console.log(error);
      } else {
        if (!user) {
          console.log(user);
          res.json(new Res(false, "danger"));
        } else {
          console.log(user);
          return res
            .status(200)
            .send(new Res(true, "google verify succ", { userProfile: user }));
        }
      }
    });
  }

  return verify().catch((err) => {
    console.error(err);
    console.log("error");
    return res
      .status(200)
      .send(new Res(false, "google verify fail", { status: false, err: err }));
  });
}

async function verifyUser(req, res) {
  console.log(req.body);
  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) res.status(400).json(new Res(false, "Verification Failed"));
    else {
      console.log(user);
      if (user != null)
        return res
          .status(200)
          .send(new Res(true, "Registered user", { isRegistered: true }));
      else {
        console.log("sed");
        return res
          .status(200)
          .send(new Res(false, "Not registered user", { isRegistered: false }));
      }
    }
  });
}

async function registerUser(req, res) {
  console.log("reg", req.body);
  let userData = new User(req.body);
  userData.save((error, registeredUser) => {
    if (error) res.status(400).json(new Res(false, "Registration Failed"));
    else {
      userStatusData = new UserStatus({
        userId: registeredUser._id,
        registeredDate: moment(),
        modifiedDate: moment(),
        isActive: true,
        isAdmin: false,
      });
      userStatusData.save((err, user) => {
        if (err)
          return res.status(400).json(new Res(false, "Registration Failed"));
        else return res.status(200).json(new Res(true, "Registration Success"));
      });
    }
  });
}

async function getUserInfo(req, res) {
  let userEmail = req.body.email;
  User.findOne({ email: userEmail }, (error, user) => {
    if (error) {
      console.err(error);
      res.status(400).json(new Res(false, "Registration Failed"));
    } else
      res.json(
        new Res(true, "User authenticated!", {
          userProfile: {
            name: user.name,
            email: user.email,
            inst: user.inst,
            status: user.status,
            isAdmin: user.isAdmin,
            isApiUser: user.isApiUser,
          },
        })
      );
  });
}

async function deleteUser(req, res) {
  let userEmail = req.body.email;
  let userId;
  console.log("email", userEmail);
  User.findOne({ email: userEmail })
    .then((result) => {
      userId = result["_id"];
      if (result) {
        User.deleteOne({ email: userEmail }).then((deleteResult) => {
          if (deleteResult) {
            UserStatus.updateOne(
              { userId: userId },
              {
                modifiedDate: moment(),
                isActive: false,
              }
            )
              .then((result) => {
                console.log(result);
                return res.status(200).json(new Res(true, "deletion succ"));
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json(new Res(false, "deletion Failed"));
              });
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

router.post("/apiRegister", (req, res) => {
  let userEmail = req.body.payload;

  console.log(userEmail);

  User.updateOne(
    { email: userEmail },
    { $set: { isApiUser: true } },
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        if (!result) {
          res.json(new Res(false, "Wrong attempt"));
        }
        res.json(new Res(true, "api auth is given!"));
      }
    }
  );
});

module.exports = router;
