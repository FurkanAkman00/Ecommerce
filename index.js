const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const { cookie } = require("express-validator");
const methodOverride = require("method-override")
const axios = require("axios")
const getBreadCrumbs = require("./middlewares/breadcrumbs")

// ERROR TRACKING
const Sentry = require("@sentry/node");
const SentryTracing = require("@sentry/tracing");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://b3432dca441a47a9a3dcc1832d521eae@o1414975.ingest.sentry.io/6755293",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// DOTENV
dotenv.config();

//Template
app.set("view engine","ejs")
app.set('views',__dirname + "/views")

// Middlewares
app.use(express.static("public"))  // static file location
app.use(express.json())
app.use(express.urlencoded({extended:true})) //Body parser
app.use(express.static('public'))
app.use(cookieParser())
app.use(methodOverride("_method",{
  methods:["POST","GET"]
}))

app.use(function (req, res, next) {

    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
      return res.sendStatus(204);
    }
    return next();
});


// Routes
const categoriesPage = require("./routes/categories")
app.use("/categories",categoriesPage)

const productsPage = require("./routes/products")
app.use("/products",productsPage)

const productPage = require("./routes/product")
app.use("/product",productPage)

const authPage = require("./routes/auth");
app.use("/auth",authPage)

const cartPages = require("./routes/cart")
app.use("/cart",cartPages)

const orderPages = require("./routes/order")
app.use("/order",orderPages)

const userPage = require("./routes/user")
app.use("/user", userPage)

const searchPage = require("./routes/search")
app.use("/search",searchPage)

// Sentry Error Handler
app.use(Sentry.Handlers.errorHandler());

// Rendering homepage
app.get("/",async (req,res) =>{
  var breadCrumbs = getBreadCrumbs("")

  res.render("home",{
      id:"home",
      breadCrumbs:breadCrumbs,
      isSignedIn:req.cookies.token
  })
})

app.listen(process.env.PORT || 5000,()=>{
    
})

module.exports = app