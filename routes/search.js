const express = require("express")
const axios = require("axios")
const router = express.Router()
const getBreadCrumbs = require("../middlewares/breadcrumbs")

router.get("/", async (req,res) =>{
    try {
        
        // Getting breadcrumbs
        var breadCrumbs = getBreadCrumbs("")
        // Getting first 25 Products
        var products = await axios.get(process.env.MAIN_URL.concat("products/product_search?",process.env.SECRET_KEY))

        var searchProducts = []
        var searchImages = []
        var counter = 2

        // While products length == 25 keep serching. And compare its name with search input
        while(products.data.length == 25){
            for(let i = 0;i< products.data.length;i++){
                if(RegExp(`.*${req.query.searchInput.toLowerCase()}.*`, "g").test(products.data[i].name.toLowerCase()) == true){
                    searchProducts.push(products.data[i])
                }
            }
        
            // If products length == 25 keep searching

            if(products.data.length == 25){
                products = await axios.get(process.env.MAIN_URL.concat("products/product_search?page=",counter,"&",process.env.SECRET_KEY))
                counter++
            } 

            // If products length < 25 break the loop 

            else if (products.data.length < 25){
                break;
            }
        }
        // Getting medium size images for search page
        for(let i = 0;i<searchProducts.length;i++){
            var temp = searchProducts[i].image_groups
            var image = temp.filter((item) =>{
                if(item.view_type == "medium" && item.variation_value == undefined){
                    return item
                }
            })[0]
            searchImages.push(image)
        }
        //Rendering search page
        res.render("search",{
            id:"home",
            breadCrumbs,
            searchImages,
            searchProducts,
            isSignedIn:req.cookies.token
        })
    
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})


module.exports = router