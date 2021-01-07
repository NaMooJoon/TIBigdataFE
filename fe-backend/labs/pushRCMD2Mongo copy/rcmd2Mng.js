const fs = require('fs');
const rcmd = require('../../models/rcmd');

const mongoose = require('mongoose'); //mongose 서버와 백엔드 연결 
const db = 'mongodb://localhost:27017/analysis';



let rawData = fs.readFileSync('./rcmdCombData.json')
let data = JSON.parse(rawData)
let rawDocInOrderData = fs.readFileSync('./doc_id_in_order.json')
let docInOrder = JSON.parse(rawDocInOrderData)["id"]


mongoose.connect(db,{server: {
                            socketOptions: {
                                socketTimeoutMS: 0,
                                connectTimeoutMS: 0
                            }
                        }
                    },
                    async function(err){
                        if (err) {
                            console.error('Error!' + err)
                        } else {
                            console.log('Connected to mongodb');
                            await sendRcmd();
                        }
                    });

async function sendRcmd() {
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
        try {
            await newKey.save((err, key) => {
                if (err)
                    console.log(err)
            })
            console.log(i, "th data done.")
        }
        catch{
            console.log("err in ", i);
        }
    }
    console.log("finish sending data")
}

mongoose.connection.close()

