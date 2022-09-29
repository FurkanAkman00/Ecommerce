const express = require("express")
const router = express.Router()
const checkAuth = require("../middlewares/checkAuth")
const getBreadCrumbs = require("../middlewares/breadcrumbs")
const { default: axios } = require("axios")

// Rendering User Page

router.get("/",checkAuth, async(req,res) =>{
    try {
        
        // Getting breadcrumbs

        var breadCrumbs = getBreadCrumbs("")
        breadCrumbs.push({key:"PROFILE",value:"/user"})

        // Getting cart item count

        const cartProducts = await axios.get(process.env.MAIN_URL.concat("cart/?",process.env.SECRET_KEY),{headers:{Authorization:`Bearer ${req.user.apiToken}`}})
        var cartItemCount = cartProducts.data.items.length
        
        // Rendering page

        res.render("user",{
            id:"profile",
            breadCrumbs,
            user:req.user,
            isSignedIn:true,
            count:cartItemCount,
        })
        
    } catch (error) {
        // If no prdoduct in cart count = 0;

        if(error.response.data.error == "There is no cart created for this user"){
            res.render("user",{
                id:"profile",
                breadCrumbs,
                user:req.user,
                isSignedIn:true,
                count:0,
            })
        }
        else {
            res.status(400).json({
                status:'fail',
                error,
            })
        }
    }
})


module.exports = router
