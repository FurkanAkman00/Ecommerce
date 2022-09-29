const express = require("express")
const router = express.Router()
const axios = require("axios")
const getBreadCrumbs = require("../middlewares/breadcrumbs.js")

router.get("/:id",async(req,res)=>{
    try {
        // Breadcrumbs
        const id = req.params.id
        var breadCrumbs = getBreadCrumbs(id)
        
        // Last category variable
        var isLastCategory = false
        
        // Getting subcategories
        const mainCategoryUrl = process.env.MAIN_URL.concat("categories/",id,"?",process.env.SECRET_KEY)
        const mainCategory = await axios.get(mainCategoryUrl)

        // Getting parent category if exists
        const subCategoryUrl = process.env.MAIN_URL.concat("categories/parent/",id,"?",process.env.SECRET_KEY)
        const subCategories = await axios.get(subCategoryUrl)
        
        // Checking if there is any subcategory. If it is last category more info link directs you to products page
        if(mainCategory.data.parent_category_id != "root"){
          isLastCategory = true 
        }
        
        // Renreding categories page
        res.render("categories",{
            mainCategory,
            subCategories,
            isLastCategory,
            id:breadCrumbs[1],
            breadCrumbs,
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