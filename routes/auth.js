const express = require("express")
const router = express.Router()
const axios = require("axios")
const getBreadCrumbs = require("../middlewares/breadcrumbs.js")
const { check, validationResult } = require('express-validator')
const JWT = require("jsonwebtoken")
const checkAuth = require("../middlewares/checkAuth")

router.get("/register", (req, res) => {
    // Rendering register page
   var breadCrumbs = getBreadCrumbs("")
   
   breadCrumbs.push({ key: "Register", value: "auth/register" })
    res.render("signup", {
        id: "register",
        breadCrumbs,
        isSignedIn:false
    })
})

// Posting to register page, checking errors
router.post("/register", [
    check('name', 'Name cannot be empty!').exists().isLength({min:1}),
    check('email', 'Email is required!').exists().normalizeEmail().isLength({min:4}),
    check("password", "Password must be at least 4 characters long").exists().isLength({ min: 4 })],
    async (req, res) => {
        
        // If errors exist render register page with alert.
        var errors = validationResult(req)

        var breadCrumbs = getBreadCrumbs("")
        breadCrumbs.push({ key: "Register", value: "auth/register" })
        
        if (!errors.isEmpty()) {

            const alert = errors.array()
            res.render('signup', {
                alert,
                id: "register",
                breadCrumbs,
                isSignedIn:false
            })
        }
        else{
            try {
                // If no errors found, post user to api
                const user = {
                    secretKey: process.env.AUTH_KEY,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }

                await axios.post(process.env.MAIN_URL.concat("auth/signup"), user)
                // If post request is successful redirect to login page
                res.redirect("/auth/login")

            } catch (error) {
                if(error.response.data.error == "User already exists"){
                    var alert = ["User already exists. Please try to login"];
                    res.render('signup', {
                        alert,
                        id: "register",
                        breadCrumbs,
                        isSignedIn:false
                    })
                } else {
                    res.status(400).json({
                        status:'fail',
                        error,
                    })
                }
            }
        }
})


router.get("/login",(req, res) => {
    
    // Rendering login page
    var breadCrumbs = getBreadCrumbs("")
    breadCrumbs.push({ key: "LOGIN", value: "auth/login" })
    
    res.render("login", {
        id: "login",
        breadCrumbs,
        isSignedIn:false
    })
})


router.post("/login", async (req, res) => {
    try {
        // Creating user object
        const user = {
            secretKey: process.env.AUTH_KEY,
            email: req.body.email,
            password: req.body.password,
        }
        
        // Getting token from api with post request
        const signedUser = await axios.post(process.env.MAIN_URL.concat("auth/signin"),user)

        // Creating my own token with given token
        const token = await JWT.sign({name:signedUser.data.user.name,email:signedUser.data.user.email,apiToken:signedUser.data.token},process.env.JWT_KEY)

        // Saving my token to as cookie
        res.cookie("token",token,{
            httpOnly:true
        })
        // Redirect to maing page
        res.redirect("/")

    } catch (error) {
        // If user informations are wrong render login page with alert
        var alert = {error:"Invalid password or email!"}
        var breadCrumbs = getBreadCrumbs("")
        
        breadCrumbs.push({ key: "LOGIN", value: "auth/login" })
       
        res.render("login", {
            isSignedIn:false,
            alert,
            id: "login",
            breadCrumbs
        })
    }
})

router.get("/logout",checkAuth,async(req,res) =>{
    try {
        // Clearing token from cookie
        res.clearCookie('token');
        res.redirect('/');
        
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
    
})


module.exports = router