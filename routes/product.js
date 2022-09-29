const express = require("express")
const router = express.Router()
const axios = require("axios")
const getBreadCrumbs = require("../middlewares/breadcrumbs.js")

router.get("/:id",async (req,res) =>{ 
    try {
        // Calling api to get product
        const productUrl = process.env.MAIN_URL.concat("products/product_search?id=",req.params.id,"&",process.env.SECRET_KEY)
        const product = await axios.get(productUrl)
        // Breadcrumbs
        var breadCrumbs = getBreadCrumbs(product.data[0].primary_category_id,product.data[0].name,product.data[0].id)

        // Getting all variations and images
        const variations = product.data[0].variation_attributes

        var images = product.data[0].image_groups

        // Pushing all large size images
        var allImages = []
        images.forEach(image =>{
            if(image.view_type == "large"){
                allImages.push(image)
            }
        })
        
        // If product not found show error message
        if(req.query.error == "notfound"){
            var alert = {error:"Product is not available at the moment. Please choose another variation!"}
        } else if(req.query.error == "incart") {
            var alert = {error:"This product is allready in cart!"}
        }
        // Rendering product page
        res.render("product",{
            id:breadCrumbs[1].value,
            breadCrumbs,
            product:product,
            isSignedIn:req.cookies.token,
            variations:variations,
            allImages,
            alert
        })

    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})

module.exports = router