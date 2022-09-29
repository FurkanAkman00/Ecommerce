const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")

describe('/GET product/:id Product Route', () => {
    it('should render the product', (done) => {
        chai.request(server)
            .get('/product/25592211')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(res).to.be.html;
                done();
            });
    });
});

describe('/GET product/:id Product Not Found Route', () => {
    it('should render not the product', (done) => {
        chai.request(server)
            .get('/product/25592211/?error=notfound')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(res).to.be.html;
                done();
            });
    });
});
