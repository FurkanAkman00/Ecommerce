const { assert, Assertion } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")
const jwt = require("jsonwebtoken")

const token = jwt.sign(
    {name:"FURKAKN",email:"rrr@hotmail.com",apiToken:"asdasd"},
    process.env.JWT_KEY,
    {
      expiresIn: "14d",
    }
)

describe('/GET User Route', () => {
    it('should User the user page', (done) => {
        chai.request(server)
            .get('/user')
            .set('Cookie', `token=${token}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'application/json; charset=utf-8'); 
                done();
            });
    });
});

