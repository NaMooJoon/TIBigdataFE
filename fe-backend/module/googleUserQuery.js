const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { OAuth2Client } = require('google-auth-library');
const Res = require("../models/Res");

/**
 * @GoogleLoginFunctions
 *  
 * 
 */

function verifyGoogleToken(req, res) {
    var token = req.body.token;
    var CLIENT_ID = req.body.client;

    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        // console.log("get ticket : ",ticket);
        const payload = ticket.getPayload();
        // const userInfo = {
        //     name: payload.name,
        //     email: payload.email
        // }
        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];  

        return res.status(200).send(new Res(true, "google verify succ", { status: true, user: payload }));
    }

    return verify().catch((err) => {
        console.error(err);
        console.log("error");
        return res.status(200).send(new Res(false, "google verify fail", { status: false, err: err }));
    })
}

router.post('/gRegister', (req, res) => {
    let userData = req.body;
    userData.auth = "google";
    let user = new User(userData);
    user.save((error, registeredUser) => {
        console.log(error, registeredUser);
        if (error) {
            console.log("google social user register data save error : " + error);
            res.json(new Res(false, "google resgister fail"));
        }
        else {
            console.log("api : gmail register : save ok");
            res.json(new Res(true, "google register ok", { succ: true, user : user.email }));
        }
    })
})

router.post('/getUserInfo', (req, res) =>{
    let userData = req.body;
    let userEmail = userData.email;

    console.log("email: " + userEmail);

    User.findOne({ email: userEmail }, (error, user) => {
        if (error){
            console.err(error);
        }
        else {
            if (!user) { 
                res.json(new Res(false, 'danger'));
            }
            else{
                console.log(user);
                res.json(new Res(true, 'User authenticated!', { name: user.name, email: user.email, inst: user.inst, nickname: user.nickName, api: user.api })); //토큰 전송
            }
        }
    })
})

router.post('/check_is_our_g_user', (req, res) => {
    console.log(req);
    let userData = req.body;
    User.findOne({ email: userData.email }, (error, user) => {
        if (error) {
            console.log("gCheckUSer error : " + error);
        }
        else {
            if (!user) {
                res.json(new Res(false, "not our user yet"));
            }
            else {
                res.json(new Res(true, "already our user"));
            }
        }
    })
})

router.post('/verifyGoogleToken', verifyGoogleToken);
module.exports = router;