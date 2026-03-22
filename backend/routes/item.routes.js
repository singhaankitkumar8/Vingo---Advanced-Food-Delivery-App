import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { addItem, deleteItem, editItem, getItemById, getItemsByCity, getItemsByShop, rating } from "../controllers/item.controllers.js"



const itemRouter=express.Router()

itemRouter.get("/getitemsbyshop/:shopId",isAuth,getItemsByShop)
itemRouter.get("/getitemsbycity/:city",isAuth,getItemsByCity)


itemRouter.post("/additem",isAuth,upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),addItem)
itemRouter.post("/edititem/:itemId",isAuth,upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),editItem)

itemRouter.get("/delete/:itemId",isAuth,deleteItem)
itemRouter.get("/getbyid/:itemId",isAuth,getItemById)
itemRouter.post("/rating",isAuth,rating)

export default itemRouter