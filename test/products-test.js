const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")

describe('/GET products/:id Products Route', () => {
    it('should render the products', (done) => {
        chai.request(server)
            .get('/products/womens-clothing-feeling-red')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(res).to.be.html;
                done();
            });
    });
});

describe('/GET products/:id Products Route', () => {
    it('should render the products', (done) => {
        chai.request(server)
            .get('/products/womens-clothing-tops/?page=1')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(res).to.be.html;
                done();
            });
    });
});