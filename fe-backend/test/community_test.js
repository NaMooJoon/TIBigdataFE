const mocha = require('mocha');
const sinon = require('sinon');
const comDoc = require('../models/community');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();

const mockRequest = (req_body) => {
    return { body: req_body }
}

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

//test methods and modules
const communityModule = require('../module/communityDocsQuery')
const writeNewDoc = communityModule.writeNewDoc;
const loadFirstDocList = communityModule.loadFirstDocList;
const loadNextDocList = communityModule.loadNextDocList;
const loadPriorDocList = communityModule.loadPriorDocList;
const DOC_NUM = communityModule.DOC_NUMBERS; // 한 페이지 당 문서의 수
const ITERATION = 10; // 몇 페이지의 문서를 생성할 것인지 결정
const TEST_NUM = DOC_NUM * ITERATION;


const Res = require('../models/Res');
const { skip } = require('rxjs-compat/operator/skip');

function removeCollection() {
    return new Promise((resolve) => {

        comDoc.remove({}, (err, res) => {
            if (err)
                console.log("delete failed");
            else
                resolve();
        })
    })
}

//describe tests
describe('community module tests', function () {
    before(function () {

    });

    // afterEach()
    after(removeCollection)

    //create tests
    it('save data test', function (done) {
        var cd = new comDoc({
            user: "username",
            title : "title",
            content: "This is long long string contents",
            date: new Date()
        });

        cd.save().then(function () {
            comDoc.find({}, (err, res) => {
                if (err)
                    done(err);
                // console.log(res)
                res.should.have.length(1);
                res = res[0]
                assert.equal(res.user, "username");
                assert.equal(res.content, "This is long long string contents");
                done();
                // assert.equal(res.date : )
            })
        });
    });

    it('remove collection test', function (done) {
        removeCollection().then(() => {

            comDoc.count({}, (err, res) => {
                assert.equal(res, 0);
            })
            done();
        })
    });

    it('writeNewDoc test', async () => {
        console.log("hello?")
        var testCases = [];
        var flag = 0;
        for (var i = 0; i < TEST_NUM; i++) {
            let req = mockRequest(
                { user: "user" + i, content: "content" + i }
            );
            let res = mockResponse();

            await writeNewDoc(req, res);

            var _res_ = new Res(true, "writeNewDoc ok");

            expect(res.json.calledWith(_res_))
            expect(res.status.calledWith(200))


        }
    })

    it('loadFirstDocList test', async () => {
        let req = mockRequest();
        let res = mockResponse();
        await loadFirstDocList(req, res);

        let data = [];
        for (var i = 0; i < TEST_NUM; i++) {
            if (i < DOC_NUM) {
                let d = {
                    "user": "user" + i,
                    "content": "content" + i
                };
                data.push(d);
            }
        }
        _res_ = new Res(true, "/loadFirstDocList ok", { data: data });
        expect(res.json.calledWith(_res_));
        expect(res.status.calledWith(200));

    })

    it('loadNextDocList test', async () => {
        let cur_start_idx = 0;
   
        for (let j = 0; j < ITERATION - 1; j++) { //전체 페이지 테스트. 맨 처음 페이지는 loadFirstDocList에서 한번 추출했다. 그래서 start_idx가 0에서 시작.
            let start_idx = cur_start_idx + DOC_NUM;
            let req = mockRequest({
                cur_start_idx: cur_start_idx
            });

            let res = mockResponse();
            await loadNextDocList(req, res);

            let data = [];
            for (let i = 0; i < data.length; i++) {
                let idx = i + new_idx;
                let d = {
                    "user": "user" + idx,
                    "content": "content" + idx
                };
                data.push(d);
            }
            cur_start_idx += 10;
            _res_ = new Res(true, "/loadNextDocList ok", { data: data, next_start_idx: start_idx });
            expect(res.json.calledWith(_res_));
        }
    })

    it('loadPriorDocList test', async () => {
        let cur_start_idx = ITERATION * DOC_NUM;
 
        for (let j = 0; j < ITERATION - 1; j++) { //전체 페이지 테스트. 맨 처음 페이지는 loadFirstDocList에서 한번 추출했다. 그래서 start_idx가 0에서 시작.
            let start_idx = cur_start_idx + DOC_NUM;
            let req = mockRequest({
                cur_start_idx: cur_start_idx
            });

            let res = mockResponse();
            await loadNextDocList(req, res);
           
            let data = [];
            for (let i = 0; i < data.length; i++) {
                let idx = i + new_idx;
                let d = {
                    "user": "user" + idx,
                    "content": "content" + idx
                };
                data.push(d);
            }
            cur_start_idx -= 10;
            _res_ = new Res(true, "/loadNextDocList ok", { data: data, next_start_idx: start_idx });
            expect(res.json.calledWith(_res_));
        }

    })
});
