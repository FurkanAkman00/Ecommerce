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

describe('/POST cart/:id Cart Route', () => {
  it('should add item to the cart and render the cart page', (done) => {
      chai.request(server)
          .post('/cart/add/25592211')
          .set('Cookie', `token=${token}`)
          .send({size:"004",color:"JJ2RVXX",width:undefined,product_quantity:"2"})
          .redirects(0)
          .end((err, res) => {
            expect(res).to.have.status(302);
            expect(err).to.be.null;
            done();
          });
  });
});

describe('/Get cart/ Cart Route', () => {
  it('should render the cart page', (done) => {
      chai.request(server)
          .get('/cart')
          .set('Cookie', `token=${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(err).to.be.null;
            expect(res).to.have.header('content-type', 'text/html; charset=utf-8'); 
            expect(res).to.be.html;
            done();
          });
  });
});

describe('/POST cart/:id Cart Route', () => {
  it('should add item to the cart and render the cart page', (done) => {
      chai.request(server)
          .post('/cart/add/25589266')
          .set('Cookie', `token=${token}`)
          .send({size:"9SM",color:"JJ3WCXX",width:undefined,product_quantity:"2"})
          .redirects(0)
          .end((err, res) => {
            expect(res).to.have.status(302);
            expect(err).to.be.null;
            done();
          });
  });
});

describe('/POST cart/quantity Cart Route', () => {
  it('should change quantity of the product and redirect to cart page', (done) => {
      chai.request(server)
          .post('/cart/quantity/?method=increment')
          .set('Cookie', `token=${token}`)
          .send({product_id:"25592211",variant_id:"701643843442",quantity_value:"1"})
          .redirects(0)
          .end((err, res) => {
            expect(res).to.have.status(302);
            expect(err).to.be.null;
            done();
          });
  });
});

describe('/DELETE cart/:id Cart Route', () => {
  it('should delete the item and redirect to the cart page', (done) => {
      chai.request(server)
          .del('/cart/25592211')
          .set('Cookie', `token=${token}`)
          .send({product_id:"25592211",variant_id:"701643843442"})
          .redirects(0)
          .end((err, res) => {
            expect(res).to.have.status(302);
            expect(err).to.be.null;
            done();
          });
  });
});