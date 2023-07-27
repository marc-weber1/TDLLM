let ch = require('chai');
let chaiHttp = require('chai-http');
const assert = require('assert');

let server = require('../server');
let api_tests = require('./apis.json');
let cli_tests = require('./clis.json');

let should = ch.should();
ch.use(chaiHttp);

describe('CLI tests', async () => {
    for(let cli_test of cli_tests){
        it('', async () => {
            var res = await ch.request(server)
                .post('/generate_and_test')
                .send(cli_test);
            assert.equal(res.statusCode, 200);
        });
    }
});

describe('API tests', async () => {
    for(let api_test of api_tests){
        it('', async () => {
            var res = await ch.request(server)
                .post('/generate_server_and_test')
                .send(api_test);
            assert.equal(res.statusCode, 200);
        });
    }
});