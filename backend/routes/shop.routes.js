import express from "express"
import { addShop, getAllShops, getCurrentShop, getShopsByCity } from "../controllers/shop.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"



const shopRouter=express.Router()

shopRouter.get("/getall",isAuth,getAllShops)
shopRouter.get("/getcurrent",isAuth,getCurrentShop)
shopRouter.post("/editshop",isAuth,upload.single("image"),addShop)
shopRouter.get("/getshopsbycity/:city",isAuth,getShopsByCity)
export default shopRouter