const express = require('express');
const User = require('../models/user');
const Res = require("../models/Res");
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

router.post('/verifyUser', verifyUser);
router.post('/registerUser', registerUser);
router.post('/getUserInfo', getUserInfo);
router.post('/verifyToken', verifyToken);

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
        User.findOne({ email: payload.email }, (error, user) => {
            if (error){
                console.err(error);
            }
            else {
                if (!user) { 
                    res.json(new Res(false, 'danger'));
                }
                else{
                    return res.status(200).send(new Res(true, "google verify succ", { 'userProfile': user }));
                }
            }
        })
    }

    return verify().catch((err) => {
        console.error(err);
        console.log("error");
        return res.status(200).send(new Res(false, "google verify fail", { status: false, err: err }));
    })
}

async function verifyUser(req, res) {
    console.log(req.body)
    User.findOne({ email: req.body.email } , (error, user) => {
        if (error) res.status(400).json(new Res(false, 'Verification Failed'));
        else{
            console.log(user);
            if (user!=null) return res.status(200).send(new Res(true, "Registered user", {'isRegistered': true}));
            else {
                console.log('sed');
                return res.status(200).send(new Res(false, "Not registered user", {'isRegistered': false}));
            }
        } 
    });
}

async function registerUser(req, res) {
    console.log('reg',req.body);
    let userData = new User(req.body);
    userData.save((error, registeredUser) => {
        if (error) res.status(400).json(new Res(false, "Registration Failed"));
        else res.status(200).json(new Res(true, "Registration Success"));
    });
}

async function getUserInfo (req, res) {
    let userEmail = req.body.email;
    User.findOne({ email: userEmail }, (error, user) => {
        if (error) {
            console.err(error);
            res.status(400).json(new Res(false, "Registration Failed"));
        }
        else res.json(new Res(true, 'User authenticated!', {'userProfile' : { 
            'name': user.name,
            'email': user.email,
            'inst': user.inst,
            'status': user.status,
            'isAdmin': user.isAdmin,
            'isApiUser': user.isApiUser }
        }));
    });
}

module.exports = router;