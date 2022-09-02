
const router = require('express').Router();  //import express
const Order = require('../models/Order');
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");



//CREATE
router.post("/",  async (req, res)=>{
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    }catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin,  async(req, res)=>{
    
    try{
        const  updateOrder= await Order.findByIdAndUpdate(req.params.id,{
            $set: req.body
            }, 
            {new:true}
        )
        res.status(200).json(updateOrder);
    }catch(err){
        res.status(500).json(err);
    }
})

//delete  
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("order has been deleted");

    }catch(err){
        res.status(500).json(err);
    }
})

//get user order 
router.get("/:userid", verifyTokenAndAuthorization, async(req, res)=>{
    try{
       const order = await Order.findOne({userid: req.params.userid});

        res.status(200).json(order);

    }catch(err){
        res.status(500).json(err);
    }
})


//get all  
router.get("/", verifyTokenAndAdmin, async(req, res)=>{
    
    try{

        const order = await Order.find();

        res.status(200).json(order);

    }catch(err){
        res.status(500).json(err);
    }
})

//GET MONTHLY inlineCompletions

router.get("/income", verifyTokenAndAdmin, async(req, res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() -1));

    try{
        
        const income = await Order.aggregate([
            {$match: {createdAt:{$gte: previousMonth}}},
            {
                $project: {
                    month: {$month: "createdAt"},
                    sales: "$amount",
                },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: "$sales"},
                },
            }
            
        ]);
        res.status(200).json(income);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router