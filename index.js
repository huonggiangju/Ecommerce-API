const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

dotenv.config();

//connect mongoDB
// const url = 'mongodb://localhost:27017/EcommerceAPI'
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("DB connection successfull"))
        .catch((err) => console.log(err));

app.use(express.json())

//call router 
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

//run server
app.listen(3000, ()=>{
    console.log('server started');
})