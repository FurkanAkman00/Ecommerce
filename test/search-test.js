
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")

// Search is taking too long, and because of that this fails

describe('/GET Search Route', () => {
    it('should render the search page', (done) => {
        chai.request(server)
            .get('/search')
            .query({searchInput: "shirt"})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                done();
            });
    });
});