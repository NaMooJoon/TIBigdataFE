const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');//javscript with token lib

const User = require('../models/user');
const Res = require("../models/Res");

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/getEuserList', (req, res) => {
    // console.log("get all user list init");
    User.find((err, allUser) => {
        // console.log(allUser);
        res.status(200).send(new Res(true, "all user list", allUser));
    });
});

/**
 * @description verify passed token and keep user activation
 * @param {*} req 
 * @param {*} res 
 */
async function verifyToken(req, res) {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send(new Res(false, 'header authorization issue'));
        }
        /* Take token from request */
        let token = JSON.parse(req.headers.authorization.split(' ')[1]).token;
        
        if (!token) {
            return res.status(401).send(new Res(false, 'token null'));
        }
        
        let payload;
        try {
            payload = jwt.verify(token, 'SeCrEtKeYfOrHaShInG')
        }
        catch (err) {
            if (err.message == "jwt expired") {
                return res.status(200).send(new Res(false, "expired"));
            }
            else {
                console.log("jwt verify error!");
                return res.status(401).send(new Res(false, "token unverified!"));
            }
        }
        if (!payload) {
            return res.status(401).send(new Res(false, 'payload undefined'));
        }

        let user_id = payload.subject
        
        await User.findOne({ _id: user_id }, (error, user) => {
            // console.log(user.name);
            if (error)
                console.log("error")
            if(user == null)
                console.log(user)
            else {
                let userInfo = new User({
                    nickName : user.nickName,
                    auth : user.auth,
                    name : user.name,
                    status : user.status,
                    inst : user.status,
                    email : user.email,
                    api : user.api,
                });
                return res.status(200).send(new Res(true, "OK", { user: userInfo }));
            }
        })
    }
    catch (err) {
        console.log("server error! : ", err);
        return res.status(500).send(new Res(false, "server error"));
    }
}

/* Checker to check duplicated email in our db */ 
router.post('/eCheckUser', (req, res) => {
    /* Read request body and save email into variable */
    let userEmail = req.body.email;
    console.log(userEmail)

    /* Send MongoDB query */
    User.findOne({ email: userEmail }, (error, user) => {
        if (error) {
            console.log("Error while checking db!");
        }
        else {
            console.log(user);
            if (!user) {
                console.log("user is not one of us");
                res.json(new Res(false));
            }
            else {
                console.log("user one of us");
                res.json(new Res(true));
            }
        }
    })
})

/* Registration of new user */
router.post('/register', (req, res) => {
    let userData = req.body;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        /* Convert password into encrypted hash and update password information with the hash */
        bcrypt.hash(userData.password, salt, (err, hash) => {
            userData.password = hash;
            userData.auth = "email";
            let user = new User(userData);
            /* Send query to save userdata into db */
            user.save((error, userData) => {
                if (error) {
                    console.log(error)
                } else {
                    /* Create and response token with user information */
                    let payload = { subject: userData._id }; 
                    var token = jwt.sign(payload, 'SeCrEtKeYfOrHaShInG', { expiresIn: '24h' });
                    res.json(new Res(true, 'User registered!', { token: token, name: user.name, email: user.email }));//토큰 전송.
                }
            })
        })
    })

})

// TODO: This query should be separated from this js. It would be better if we have common query model that can be used for both google and general email user.
router.post('/apiRegister', (req, res)=>{
    let userEmail = req.body.payload;

    console.log(userEmail);

    User.updateOne(
        { email: userEmail} ,
        { $set: { api: true } }, (error, result) => {
            if(error){
                console.log(error);
            }
            else{
                if (!result){
                    res.json(new Res(false, 'Wrong attempt'));
                }
                res.json(new Res(true, 'api auth is given!'));
            }
        }
    )

})

/* Login */
router.post('/login', (req, res) => {
    let userData = req.body;
    let userEmail = userData.email;

    /* send query to get user information that has userEmail information */
    User.findOne({ email: userEmail }, (error, user) => {
        if (error) {
            console.err(error)
        }
        else {
            if (!user) { 
                res.json(new Res(false, 'danger'));
            }
            else {
                bcrypt.compare(userData.password, user.password, function (err, result) {
                    /* Case when password does not match */
                    if (!result) {
                        res.json(new Res(false, 'pw'));
                    }
                    else {
                        let payload = { subject: user._id }; //토큰에 오고 갈 정보 : id
                        var token = jwt.sign(payload, 'SeCrEtKeYfOrHaShInG', { expiresIn: '24h' }); //토큰 발급.
                        res.json(new Res(true, 'User authenticated!', { token: token, name: user.name, email: user.email, inst: user.inst, nickname: user.nickName, api: user.api })); //토큰 전송
                    }
                });
            }
        }
    })
})

router.post('/verify', verifyToken);
module.exports = router;
