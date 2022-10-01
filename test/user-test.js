const { assert, Assertion } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")
const jwt = require("jsonwebtoken")
const { default: axios } = require('axios');

var token
const user = {
    secretKey: process.env.AUTH_KEY,
    email: "bbb@gmail.com",
    password: "123456",
}
axios.post(process.env.MAIN_URL.concat("auth/signin"),user).then(user =>{
    token = jwt.sign(
        {name:"FURKAKN",email:"rrr@hotmail.com",apiToken:user.data.token,},
        process.env.JWT_KEY,
        {
        expiresIn: "14d",
        }
    )
}).catch(e =>{
    console.error(error)
})

describe('/GET User Route', () => {
    it('should User the user page', (done) => {
        chai.request(server)
            .get('/user')
            .set('Cookie', `token=${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                done();
            });
    });
});

