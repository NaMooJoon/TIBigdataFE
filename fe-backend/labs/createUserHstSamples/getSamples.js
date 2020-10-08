var spawn = require('child_process').spawn;
const pyDir = "../../../../TIBigdataMiddleware/Labs/sample user history"
var py = spawn('python', ['history.py'], { cwd: pyDir });
const fs = require('fs');

const hst = require('../../models/history');

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const mongoose = require('mongoose'); //mongose 서버와 백엔드 연결 


// const PORT = 4000;

// const db = 'mongodb://localhost:27017/user';


// mongoose.connect(db, err => {
//     if (err) {
//         console.error('Error!' + err)
//     } else {
//         console.log('Connected to mongodb');
//     }
// });

// app.use(cors());
// app.use(bodyParser.json());

// //root dir
// app.get('/', function (req, res) {
//     res.send('Hello from server');
// })

// //server listen with no time interval?
// app.listen(PORT, function () {
//     console.log('Express server running on port ' + PORT)
// });


let sampleList = [];

py.stdout.on('data', (d) => {
    var rawdata = fs.readFileSync(pyDir + '/tokened_history.json');
    let data = JSON.parse(rawdata);
    // console.log(data.length);
    //샘플데이터를 생성하는 부분
    var count = 0;
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            /**
             * Shema
                    {

                        keyword : String,
                        year : Number,//2019
                        month : Number,//1~12
                        date : Number,//1~31.1,3,5,7,8,10,12, 1~30, 4,6,9,11. 1~28 for 2.
                        hour : Number,0~23.
                        min : Number, 0~59.
                        time : javascript Date
                    }
             */

            var mth = Math.floor(Math.random() * 12) + 1;
            var keyword = data[i][j];
            var year = 2019;
            var month = Math.floor(Math.random() * 12) + 1;
            var date = mth == (1 || 3 || 5 || 7 || 8 || 10 || 12) ? Math.floor(Math.random() * 31) + 1 : (mth == (4 || 6 || 9 || 11) ? Math.floor(Math.random() * 30) + 1 : Math.floor(Math.random() * 28) + 1);
            var hour = Math.floor(Math.random() * 24);
            var min = Math.floor(Math.random() * 60);



            let tt = Date.parse(date + " " + month + " " + year + " " + hour + ":" + min + ":00")
            // console.log(typeof(tt));
            if (!isNaN(tt)) {//땜빵용 코드... date을 만들어서 invalid한 결과는 지운다.
                // console.log(tt)
                let hstData = {
                    keyword: keyword,
                    year: year,
                    month: month,
                    date: date,
                    hour: hour,
                    min: min,
                    time: tt
                }
                sampleList.push(hstData)
            }
        }

    }

    //샘플 데이터 시간 순으로 정렬
    sampleList.sort((a, b) => {
        return b.time - a.time
    })
    sampleList.forEach(e => {

        newHst = new hst(e);
        newHst.save((err, h) => {
            if (err) {
                console.log("add history fail. error : " + err);
            }
        });
    })


})


py.stdout.on("close", () => {
    console.log("done!");
})

