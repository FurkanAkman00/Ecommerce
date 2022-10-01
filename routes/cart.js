const express = require("express")
const router = express.Router()
const axios = require("axios")
const getBreadCrumbs = require("../middlewares/breadcrumbs.js")
const checkAuth = require("../middlewares/checkAuth.js")
const { check } = require("express-validator")

router.post("/add/:id",checkAuth,async(req,res) =>{
    try {
        // Getting product information from api
        var product = await axios.get(process.env.MAIN_URL.concat("products/product_search?id=",req.params.id,"&",process.env.SECRET_KEY))
        product = product.data[0]
        var variant_id

        // Finding variant id with the information from req.body
        
        product.variants.forEach(variant => {
                if(variant.variation_values.color == req.body.color && variant.variation_values.width == req.body.width && variant.variation_values.size == req.body.size){
                    variant_id = variant.product_id
                }
        })

        // Creating product object for api
        var cartProduct = {
            secretKey:process.env.AUTH_KEY,
            productId:product.id,
            variantId:variant_id,
            quantity:req.body.product_quantity
        }

        // Making post request to api
       var temp = await axios.post(process.env.MAIN_URL.concat("cart/addItem"),cartProduct,{headers:{Authorization:`Bearer ${req.user.apiToken}`}})
       // Redirecting to cart page
       res.redirect("/cart")

    } catch (error) {
        // If there arent variant id for choosen variations, Redirect to product page with alert
        if(error.response.data.error == "You must inform a Variant ID"){ res.redirect(`/product/${product.id}?error=notfound`) } 
        
        else if(error.response.data.error == "This Item is already in your cart"){ res.redirect(`/product/${product.id}?error=incart`) } 
        
        else {
            res.status(400).json({
                status:'fail',
                error,
            })
        }
    }
})

router.get("/",checkAuth,async (req,res) =>{
    try {
        // BreadCrumbs
        var breadCrumbs = getBreadCrumbs("")
        breadCrumbs.push({key:"CART",value:"/cart?".concat(process.env.SECRET_KEY)})
        
        // Getting all products from cart
        const cartProducts = await axios.get(process.env.MAIN_URL.concat("cart/?",process.env.SECRET_KEY),{headers:{Authorization:`Bearer ${req.user.apiToken}`}})

        var images = []
        var products = []

        // Looping over products
        for(let i = 0; i<cartProducts.data.items.length;i++){
            
            // Getting the product information
            let product = await axios.get(process.env.MAIN_URL.concat("products/product_search?id=",`${cartProducts.data.items[i].productId}`,"&",process.env.SECRET_KEY))
            // Choosing the right image for variation value
                product.data[0].image_groups.forEach(item =>{
                    if(item.view_type == "medium" && item.variation_value == cartProducts.data.items[i].variant.variation_values.color){
                        images.push(item.images[0].link)
                    }
                })
                products.push(product.data[0])
        }

        // Calculating total price
        var totalPrice = 0
        cartProducts.data.items.forEach(item =>{
            totalPrice = totalPrice + (item.variant.price * item.quantity)
        })
        // Rendering cart page
        res.render("cart",{
            cartProducts:cartProducts.data.items,
            products,
            images,
            id:"cart",
            breadCrumbs,
            isSignedIn:true,
            totalPrice
        })
        
    } catch (error) {
        // If cart is empty, render the cart page with alert
        if(error.response.data.error == "There is no cart created for this user"){
            res.render("cart",{
                cartProducts:undefined,
                id:"cart",
                breadCrumbs:breadCrumbs,
                isSignedIn:req.cookies.token
            })
        } else {
            res.status(400).json({
                status:'fail',
                error,
            })
        }
    }
})

router.delete("/:productId",checkAuth,async (req,res) =>{
    try {
        
        // Creating the object for api
        var item = {
            secretKey: process.env.AUTH_KEY,
            productId: req.body.product_id,
            variantId: req.body.variant_id            
        }

        // Making api request to delete
        await axios.delete(process.env.MAIN_URL.concat("cart/removeItem"),{data:item,headers:{Authorization:"Bearer "+req.user.apiToken}})

        res.redirect("/cart")

    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})

router.post("/quantity",checkAuth,async (req,res) =>{
    try {
        var quantity;
        
        // Getting quantity information and value from query and ody
        if(req.query.method == "increment"){
            quantity = ++req.body.quantity_value
        } else { quantity = req.body.quantity_value - 1}

        // Creating object for api
        var quantity = {
            secretKey: process.env.AUTH_KEY,
            productId: req.body.product_id,
            variantId: req.body.variant_id,
            quantity,
        }
        // Making post request
        await axios.post(process.env.MAIN_URL.concat("cart/changeItemQuantity"),quantity,{headers:{Authorization:`Bearer ${req.user.apiToken}`}})

        res.redirect("/cart")

    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})
module.exports = router