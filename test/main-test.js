const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('../index.js');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index.js")


describe('/GET categories/:id Parent Categories Route', () => {
    it('should render the parent categories', (done) => {
        chai.request(server)
            .get('/categories/womens')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                done();
            });
    });
});

describe('GET /:id Categories Route', () => {
    it('should render the categories', (done) => {
        chai.request(server)
            .get('/categories/womens-clothing')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                done();
            });
    });
});