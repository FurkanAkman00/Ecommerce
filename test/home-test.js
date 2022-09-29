const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")

describe('Home Route', () => {
    it('should render the home page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                done();
            });
    });
});