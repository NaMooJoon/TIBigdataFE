const fs = require('fs');
const rcmd = require('../../models/rcmd');
const keyword = require('../../models/tfidf');

const mongoose = require('mongoose'); //mongose 서버와 백엔드 연결 
const db = 'mongodb://localhost:27017/analysis';

let modelArr = [rcmd, keyword];
let numDataArr = [];




mongoose.connect(db, {
    server: {
        socketOptions: {
            socketTimeoutMS: 0,
            connectTimeoutMS: 0
        }
    }
},
    async function (err) {
        if (err) {
            console.error('Error!' + err)
        } else {
            console.log('Connected to mongodb');
            await sendRcmd();
            await sendTFIDF();
            console.log("plz wait a min...");
            let flag = 0;
            var checkData = setInterval(async () => {
                for (let i = 0; i < numDataArr.length; i++) {
                    await modelArr[i].count({}, (err, count) => {
                        if (count < numDataArr[i]) {
                            console.log("data size mismatch in ", modelArr[i], " database. some data are missing.");
                            flag = 0;
                        }
                        else
                            flag++;
                    })
                }

                if (flag >= 3) {
                    console.log("all data has been saved. turn off the program by keyborad interruption.")
                    clearInterval(checkData);
                }
                else {
                    console.log("some data are missing... waiting for completing to write data...")
                }
            }, 1000)
        }
    });

async function sendCat() {
    let rawData = fs.readFileSync("./ctgRNNResult.json");
    let data = JSON.parse(rawData)
    console.log(typeof(data));



}
async function sendRcmd() {

    let rawData = fs.readFileSync('./rcmdCombData.json')
    let data = JSON.parse(rawData)
    let rawDocInOrderData = fs.readFileSync('./doc_id_in_order.json')
    let docInOrder = JSON.parse(rawDocInOrderData)["id"]

    console.log("sending data started...")
    for (var i in data) {
        var rcmdData = data[i][1]["rcmd"]
        for (var j = 0; j < rcmdData.length; j++) {
            var docNum = rcmdData[j][0];
            rcmdData[j][0] = docInOrder[docNum]
        }
        newKey = new rcmd({
            docID: data[i][0]["id"],
            rcmd: data[i][1]["rcmd"]
        })
        await newKey.save((err) => {
            if (err)
                console.log(i, "th data done.\n", err)
        })
    }
    numDataArr.push(data.length - 1);
    console.log("finish sending rcmd data")
}


async function sendTFIDF() {
    console.log("sending tfidf data started...")
    let rawTfidfData = fs.readFileSync('./tfidfData.json')
    if (!rawTfidfData)
        throw "read file error in tfidf"
    let tfidfData = JSON.parse(rawTfidfData)

    for (var i in tfidfData) {
        let title;
        if (typeof (tfidfData[i]["docTitle"]) == "string")
            title = tfidfData[i]["docTitle"];
        else
            title = tfidfData[i]["docTitle"][0]
        newKey = new keyword({
            docTitle: title,
            docID: tfidfData[i]["docID"],
            tfidf: tfidfData[i]["TFIDF"]
        })
        await newKey.save((err) => {
            if (err)
                console.log(i, "th data done.\n", err)
        })
    }
    numDataArr.push(tfidfData.length - 1);
    console.log("finish sending tfidf data")

}

// mongoose.connection.close()

