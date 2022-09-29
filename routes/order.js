const stripe = require("stripe")(process.env.STRIPE_KEY)
const express = require("express")
const router = express.Router()
const axios = require("axios")
const checkAuth = require("../middlewares/checkAuth")
const { check } = require("express-validator")
const getBreadCrumbs = require("../middlewares/breadcrumbs.js")

router.post("/:id",checkAuth,async (req,res) =>{
    try {
        // Getting product with api 
        var product = await axios.get(process.env.MAIN_URL.concat("products/product_search?id=",req.params.id,"&",process.env.SECRET_KEY))
        var variant_id

        // Checking if selected variant is available
        product.data[0].variants.forEach(variant => {
            if(variant.variation_values.color == req.body.color && variant.variation_values.width == req.body.width && variant.variation_values.size == req.body.size){
                variant_id = variant.product_id
            }
        })
        // If product is not available redirect to product page with error alert
        if(!variant_id){
            res.redirect("/product/"+product.data[0].id+"?error=notfound")
        }

        else{
            // If porduct is available start stripe session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [{
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name:product.data[0].name
                        },
                        unit_amount: (product.data[0].price * 100)
                    },
                    quantity:req.body.product_quantity
                }],
                success_url:`${process.env.SERVER_URL}order/result?order=success`,
                cancel_url:`${process.env.SERVER_URL}order/result?order=failed`,
            })
            // Redirect to stripe payment page
            res.redirect(303, session.url);
        }
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})

router.get("/",checkAuth,async (req,res) =>{
    try {
        // Getting all the products from cart
        const cartProducts = await axios.get(process.env.MAIN_URL.concat("cart/?",process.env.SECRET_KEY),{headers:{Authorization:`Bearer ${req.user.apiToken}`}})

        var lineItems = []
        var counter = 0
        
        // Creating objects for stripe session
        cartProducts.data.items.forEach(item =>{
            counter++
            lineItems.push({
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:`Product ${counter}`
                    },
                    unit_amount:(item.variant.price * 100)
                },
                quantity:item.quantity
            })
        })
        // Starting Stripe session with objects we created
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: 'payment',
            success_url:`${process.env.SERVER_URL}order/result?order=success`,
            cancel_url:`${process.env.SERVER_URL}order/result?order=failed`,
            line_items: lineItems,
        });
        // Redirecting to stripe payment page
        res.redirect(303, session.url);
        
    } catch (error) {
        res.status(400).json({
            status:'fail',
            error,
        })
    }
})


router.get("/result",checkAuth,async (req,res) =>{
    try {
        // Result page for stripe session
        var breadCrumbs = getBreadCrumbs("")
        var alert

        if(req.query.order == "success"){

            alert = "Payment successful, Thank you for your purchase!"

            const cartProducts = await axios.get(process.env.MAIN_URL.concat("cart/?",process.env.SECRET_KEY),{headers:{Authorization:`Bearer ${req.user.apiToken}`}})
           
            // If payment is successfull then remove all items from cart
            for(let i=0;i<cartProducts.data.items.length;i++){
                await axios.delete(process.env.MAIN_URL.concat("cart/removeItem"),{data:{secretKey:process.env.AUTH_KEY,
                productId:cartProducts.data.items[i].productId,
                variantId:cartProducts.data.items[i].variant.product_id},
                headers:{Authorization:"Bearer "+req.user.apiToken}})
            }

        // Else show alert 
        } else if(req.query.order == "failed"){
            alert = "Payment cancelled"
        }
        
        // Rendering result page
        res.render("result",{
            alert,
            id:"home",
            breadCrumbs:breadCrumbs,
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