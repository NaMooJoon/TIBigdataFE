const fs = require('fs');
const rcmd = require('../../models/rcmd');
const keyword = require('../../models/tfidf');
const Topic = require('../../models/topic');




let modelArr = [keyword];

// let modelArr = [rcmd, keyword,Topic];
let numDataArr = [];


async function run() {


    console.log('Connected to mongodb');
    // await sendTopic();
    // await sendRcmd();
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
run();

async function sendTopic() {
    let rawData = fs.readFileSync("./ctgRNNResult.json");
    let data = JSON.parse(rawData)
    let count = 0;
    console.log("sending data started...")
    let arr = [];
    for (var i in data) {
        var topData = data[i];
        var tp = topData["topic"];
        console.log(topData["topic"])
        let docs = topData["doc"];
        // console.log(docs)

        for (var j = 0; j < docs.length; j++) {
            console.log(docs[j]["titles"])
            arr.push(
                {
                    topic: tp,
                    docID: docs[j]["idList"],
                    docTitle: docs[j]["titles"],
                }
            )
            count++;
        }

        // newTop = new Topic(

        //     // { topic: topData["topic"], doc: topData["doc"] }
        // )
    }
    Topic.insertMany(arr, err => {
        if (err)
            console.log("top data save filed.")
    })
    numDataArr.push(count - 1);
    console.log("finish sending topic data")

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
    let rawTfidfData = fs.readFileSync('./tfidfData0919.json')
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

