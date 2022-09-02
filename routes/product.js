
const router = require('express').Router();  //import express
const Product = require('../models/Product');
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");



//CREATE
router.post("/", verifyTokenAndAdmin, async(req, res)=>{
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    }catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", verifyTokenAndAdmin,  async(req, res)=>{
    
    try{
        const  updateProduct= await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body
            }, 
            {new:true}
        )
        res.status(200).json(updateProduct);
    }catch(err){
        res.status(500).json(err);
    }
})

//delete  
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("product has been deleted");

    }catch(err){
        res.status(500).json(err);
    }
})

//get by id  
router.get("/:id",  async(req, res)=>{
    try{
       const product = await Product.findById(req.params.id);

        res.status(200).json(product);

    }catch(err){
        res.status(500).json(err);
    }
})


//get all  
router.get("/",  async(req, res)=>{
    const queryNew = req.query.new;
    const queryCat = req.query.category;
    try{

        let products;

        if(queryNew){
            products = await Product.find().sort({createdAt: -1}).limit(1)
        }else if(queryCat){
            products = await Product.find(
                {categories:{
                    $in: [queryCat],
                },
        });
        }else{
            products = await Product.find();
        }
    

        res.status(200).json(products);

    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router