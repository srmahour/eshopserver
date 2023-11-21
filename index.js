require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
    
    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.title,
                images:[product.images]
            },
            unit_amount:product.price * 100,
        },
        quantity:product.quantity
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        shipping_address_collection: {
            allowed_countries: ['IN'],
          },
        phone_number_collection: {
            enabled: true,
        },
        success_url:`${process.env.FRONTEND_URL}success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${process.env.FRONTEND_URL}cancel`,
    });

    
    res.json({id:session.id})
 
})


app.get('/', function(req, res){
    res.send('Hello it is working my express project')
})


app.listen(1992,()=>{
    console.log("server start")
})