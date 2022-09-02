
const router = require('express').Router();  //import express
const Cart = require('../models/Cart');
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");



//CREATE
router.post("/",  async (req, res)=>{
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);

    }catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAuthorization,  async(req, res)=>{
    
    try{
        const  updateCart= await Cart.findByIdAndUpdate(req.params.id,{
            $set: req.body
            }, 
            {new:true}
        )
        res.status(200).json(updateCart);
    }catch(err){
        res.status(500).json(err);
    }
})

//delete  
router.delete("/:id", verifyTokenAndAuthorization, async(req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("cart has been deleted");

    }catch(err){
        res.status(500).json(err);
    }
})

//get user cart 
router.get("/:userid", verifyTokenAndAuthorization, async(req, res)=>{
    try{
       const cart = await Cart.findOne({userid: req.params.userid});

        res.status(200).json(cart);

    }catch(err){
        res.status(500).json(err);
    }
})


//get all  
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    
    try{

        const cart = await Cart.find();

        res.status(200).json(cart);

    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router