require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")('sk_test_51F0lhcBf7UcC2CL7cRM4ASgFSgLTYGkSylgKhtm3YvuHb0EnGTjvzoA4TQ0lk0s4Iip1eYnfp2s47jLs2sQU8ft900XmHBTbCr');

app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
    console.log(products)

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
        success_url:"http://localhost:5173/success",
        cancel_url:"http://localhost:5173/cancel",
    });

    res.json({id:session.id})
 
})


app.listen(1992,()=>{
    console.log("server start")
})