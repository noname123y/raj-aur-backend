import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app=express()
// middleware setting
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(cookieParser())
 
// config setting
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb"}))
app.use(express.static("public"))


//routes import

import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users",userRouter)

export {app};

