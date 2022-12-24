const router = require('express').Router();  //import express
const User = require('../models/User')
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

//REGISTRATION
router.post("/register", async(req, res)=>{

    const newUser =  new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
                    req.body.password, 
                    process.env.PASS_SEC)
                    .toString(),
    });
    try{
        const saveUser = await newUser.save();
        res.status(200).json(saveUser);
    }catch(err){
        res.status(500).json(err);
    }
    
});

//LOGin
router.get("/login", async(req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username});

        if(!user){
            res.status(401).json("wrong credentials1");
        }
        const hashPw = CryptoJS.AES.decrypt(
                        user.password,
                        process.env.PASS_SEC);

        const originalPassword = hashPw.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password){
            res.status(401).json("wrong credentials"); 
        }else{
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin,
            }, process.env.JWT_SEC,
             {expiresIn: "300d"});

            const {password, ...others} = user._doc; //dont show password
            
            res.status(200).json({...others, accessToken});
        }

    }catch(err){
        res.status(500).json(err);
    }
});



module.exports = router