const JWT = require("jsonwebtoken")

module.exports = async (req,res,next) => {
    if(req.cookies.token){
        var token = req.cookies.token
        try {
            let user = await JWT.verify(token,process.env.JWT_KEY)
            req.user = user
            next()
        } catch (error) {
            next()
        }
    } else {
        res.redirect("/auth/login")
    }
}