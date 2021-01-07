const mocha = require('mocha');
const sinon = require('sinon');
const topic = require('../models/topic');
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should();
var topicModule = require('../module/topicQuery');
var getTbl = topicModule.getTopicTbl;
var getOneTbl = topicModule.getOneTopicDocs;

const mockRequest = (req_body) => {
    return { body: req_body }
}

const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
};

const Res = require('../models/Res');

describe("topic module test", function(){
    it('ask query test', function(done){
        topic.find({"topic" : "정치"}).limit(1).exec((err, result)=>{
            if(err)
                console.log(err)
            else{
                console.log(result);
                done();
            }
        })
    })

    it('getTopicTbl function test', async function(){

    
        // for (let j = 0; j < ITERATION - 1; j++) { //전체 페이지 테스트. 맨 처음 페이지는 loadFirstDocList에서 한번 추출했다. 그래서 start_idx가 0에서 시작.
            // let start_idx = cur_start_idx + DOC_NUM;
            let req = mockRequest({
                topic : "정치"
            });

            let res = mockResponse();
            await getOneTbl(req, res);
            // console.log(res.json);
            // done();
            // let data = [];
            // for (let i = 0; i < data.length; i++) {
            //     let idx = i + new_idx;
            //     let d = {
            //         "user": "user" + idx,
            //         "content": "content" + idx
            //     };
            //     data.push(d);
            // }
            // cur_start_idx += 10;
            // _res_ = new Res(true, "/loadNextDocList ok", { data: data, next_start_idx: start_idx });
            // expect(res.json.calledWith(_res_));
        // }
    })

    
});