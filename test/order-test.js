const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const server = require("../index")
const jwt = require("jsonwebtoken")
const axios = require("axios")

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



describe('/Post order/:id Order Fail Route', () => {
    it('should redirect to the product page with error message', (done) => {
        chai.request(server)
            .post('/order/25592211')
            .set('Cookie', `token=${token}`)
            .redirects(0)
            .end((err, res) => {
                expect(res).to.have.status(302);
                expect(res).to.have.header('content-type', 'text/plain; charset=utf-8'); 
                expect(err).to.be.null;
                done();
            });
    });
});

describe('/Post order/:id Order Product Route', () => {
    it('should redirect to the single product order page', (done) => {
        chai.request(server)
            .post('/order/25592211')
            .set('Cookie', `token=${token}`)
            .send({size:"008",color:"JJ2RVXX",width:undefined,product_quantity:"2"})
            .redirects(0)
            .end((err, res) => {
                expect(res).to.have.status(303);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/plain; charset=utf-8'); 
                done();
            });
    });
});

describe('/GET order/ order Products Route', () => {
    it('should redirect to the order page with multiple products', (done) => {
        chai.request(server)
            .get('/order')
            .set('Cookie', `token=${token}`)
            .redirects(0)
            .end((err, res) => {
                expect(res).to.have.status(303);
                expect(err).to.be.null;
                expect(res).to.have.header('content-type', 'text/plain; charset=utf-8'); 
                done();
            });
    });
});

describe('/GET order/result/ Order Success Route', () => {
    it('should redirect to the result page and show successful order text', (done) => {
        chai.request(server)
            .get('/order/result/?order=success')
            .set('Cookie', `token=${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(err).to.be.null;
                expect(res).to.be.html;
                done();
            });
    });
});

describe('/GET order/result/ Order Fail Route', () => {
    it('should redirect to the result page and show fail order text', (done) => {
        chai.request(server)
            .get('/order/result/?order=failed')
            .set('Cookie', `token=${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
                expect(err).to.be.null;
                expect(res).to.be.html;
                done();
            });
    });
});

