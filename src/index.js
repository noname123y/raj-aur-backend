import mongoose from "mongoose";

import connectDB from "./db/index.js";
import dotenv from "dotenv"


dotenv.config({
    path:'./env'
})



connectDB();

/*
import express from express

const app= express()

;(async()=>{
    try{
    await mongoose.connect(`${process.env.MONGOOSE_URI}/${DB_NAME}`)
    app.on("Error",(error)=>{
        console.log("ERR:",error);
        throw error

    })
    app.listen(process.env.PORT,()=>{
        console.log(`${process.env.PORT}`);
    })

}catch(error){
    console.log("ERROR:",error)
    throw error
}

})()*/