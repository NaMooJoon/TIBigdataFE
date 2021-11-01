const express = require("express");
const moment = require("moment");
const apiuser = require("../models/apiuser");
const UserStatus = require("../models/userStatus");
const Res = require("../models/Res");

const router = express.Router();

// router.post("/verifyUser", verifyUser);
// router.post("/registerUser", registerUser);
router.post("/getApiInfo", getApiInfo);
// router.post("/verifyToken", verifyToken);
// router.post("/deleteUser", deleteUser);

async function getApiInfo(req, res) {
    let userEmail = req.body.email;
    apiuser.find({ user_email: userEmail })
    .then((result) => {
        // console.log(result);
        let count;
        let info;
        if (result){
            count = result.length;
            for (let item of result){
                delete item.veri_code;
            }
            
          return res
            .status(200)
            .json(
              new Res(true, "successfully saved doc HashKeys", {count:count, info: result})
            );
        }
        else{
          return res
          .status(200)
          .json(
            new Res(false, "no info",{count:0, info:[]})
          );
        }
    });
    //   }), (error, api) => {
    //     console.log(api);
    //   if (error) {
    //     console.err(error);
    //     res.status(400).json(new Res(false, "API Registration Failed"));
    //   } else
    //     res.json(
    //       new Res(true, "API User authenticated!", {
    //         apiInfo: {
    //           app_name: api.app_name,
    //           app_purpose: api.app_purpose,
    //           email: api.user_email,
    //           reporting_date: api.reporting_date,
    //           expiration_date: api.expiration_date,
    //           traffic: api.traffic,
    //         },
    //       })
    //     );
    // });
  }

  
module.exports = router;