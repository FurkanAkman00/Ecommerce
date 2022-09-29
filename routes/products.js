const express = require("express")
const router = express.Router()
const axios = require("axios")
const getBreadCrumbs = require("../middlewares/breadcrumbs.js")

router.get("/:id",async (req,res)=>{
    try {
        //Getting breadcrumbs
        var breadCrumbs = getBreadCrumbs(req.params.id)
        
        // Getting page
        var page = req.query.page
        
        // api call
        const productsUrl = process.env.MAIN_URL.concat("products/product_search?primary_category_id=",req.params.id,"&page=",req.query.page,"&",
        process.env.SECRET_KEY)

        var products = await axios.get(productsUrl)
        products = products.data

        var medImages = [] ;

        // Getting medium sized images for products page

        for(let i = 0;i<products.length;i++){
            var temp = products[i].image_groups
            var image = temp.filter((item) =>{
                if(item.view_type == "medium" && item.variation_value == undefined){
                    return item
                }
            })[0]
            medImages.push(image)
        }

        // Rendering products page
        res.render("products",{
            id:breadCrumbs[1].value,
            breadCrumbs,
            products:products,
            medImages,
            isSignedIn:req.cookies.token,
            page
        })

    } catch (error) {
        
        if(error.response.data.error == "Product Not Found"){
            res.render("products",{
                id:breadCrumbs[1].value,
                breadCrumbs,
                products:undefined,
                medImages:undefined,
                isSignedIn:req.cookies.token,
                page,
            })
        }
        else{
            res.status(400).json({
                status:'fail',
                error,
            })
        }
    }
})

module.exports = router