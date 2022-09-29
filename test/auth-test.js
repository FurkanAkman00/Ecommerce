const chai = require('chai');
const chaiHttp = require('chai-http');
const e = require('express');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")
const jwt = require("jsonwebtoken");
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
    return e
})

describe('/GET Login Route', () => {
    it('should render the login page', (done) => {
        chai.request(server)
            .get('/auth/login')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(res).to.be.html;
                done();
            });
    });
});


describe('/GET Register Route', () => {
    it('should render the register page', (done) => {
        var res = chai.request(server)
            .get('/auth/register')
            .end((err,res) =>{
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                expect(res).to.be.html;
                done();
            })
    });
});

describe("/POST Login",() =>{
    it("Should Login user  and redirect", (done) =>{
        chai.request(server)
            .post("/auth/login")
            .send({password:"123456",email:"bbb@gmail.com"})
            .redirects(0)
            .end((err,res) =>{
                expect(res).to.have.status(302);
                expect(err).to.be.null;
                done()
        })
    })
})

describe("/POST Error Login",() =>{
    it("Should redirect user to login page", (done) =>{
        chai.request(server)
            .post("/auth/login")
            .send({password:"123",email:"bbb@gmail.com"})
            .end((err,res) =>{
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                done()
        })
    })
})

describe("/POST Logout",() =>{
    it("Should Logout user and redirect", (done) =>{
        chai.request(server)
            .get("/auth/logout")
            .set('Cookie', `token=${token}`)
            .redirects(0)
            .end((err,res) =>{
                expect(res).to.have.header('content-type', 'text/plain; charset=utf-8'); 
                expect(res).to.have.status(302);
                expect(err).to.be.null;
                done()
        })
    })
})

describe("/POST Register",() =>{
    it("Should save user to api and redirect", (done) =>{
        chai.request(server)
            .post("/auth/register")
            .set('content-type', 'application/json')
            .send({name:"Furkncrda",password:"12rf34456712",email:"rrrrfrr@hotmail.com"})
            .redirects(0)
            .end((err,res) =>{
                expect(res).to.have.status(302);
                expect(err).to.be.null;
                done()
            })
    })
})
