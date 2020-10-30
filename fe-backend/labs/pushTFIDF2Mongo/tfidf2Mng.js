const fs = require('fs');
const keyword = require('../../models/tfidf');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose'); //mongose 서버와 백엔드 연결 


const PORT = 4000;

const db = 'mongodb://localhost:27017/analysis';
let rawData = fs.readFileSync('./data.json')
app.use(cors());
app.use(bodyParser.json());
let data = JSON.parse(rawData)

mongoose.connect(db, {
    server: {
        socketOptions: {
            socketTimeoutMS: 0,
            connectTimeoutMS: 0
        }
    }
},
    err => {
        if (err) {
            console.error('Error!' + err)
        } else {
            console.log('Connected to mongodb');
        }
    });


//root dir
app.get('/', function (req, res) {
    res.send('Hello from server');
    send();

})

// send()

function send() {
    // console.log(typeof(data[0]["docID"]))
    for (var i in data) {
        let title;
        if (typeof (data[i]["docTitle"]) == "string")
            // console.log(data[i]["docTitle"])
            title = data[i]["docTitle"];
        else
            title = data[i]["docTitle"][0]
        // console.log(data[i]["docTitle"][0])
        newKey = new keyword({
            docTitle: title,
            docID: data[i]["docID"],
            tfidf: data[i]["TFIDF"]
        })
        newKey.save((err, key) => {
            if (err)
                console.log(err)
        })
    }
}

//server listen with no time interval?
app.listen(PORT, function () {
    console.log('Express server running on port ' + PORT)
});

