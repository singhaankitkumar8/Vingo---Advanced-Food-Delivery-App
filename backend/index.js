import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import shopRouter from "./routes/shop.routes.js"
import itemRouter from "./routes/item.routes.js"
import orderRouter from "./routes/order.routes.js"
import http from "http"
import { Server } from "socket.io"
import socketHandler from "./socket.js"
dotenv.config()
const port = process.env.PORT || 5000
const app=express()
const server=http.createServer(app)
const io=new Server(server,{
     cors: {
    origin: process.env.FRONTEND_URL, // in production specific domain 
    methods: ["GET", "POST"],
    credentials: true  
  }
})
app.set("trust proxy", 1);
app.set("io", io);
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
//app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)

app.use("/api/item", (req, res, next) => {
  console.log("Item route hit:", req.method, req.originalUrl);
  next();
}, itemRouter);

socketHandler(io)


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

server.listen(port,()=>{
    console.log(`server started at ${port}`)
    connectDb()
})