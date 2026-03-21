import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, searchItems, updateUserLocation,getReels,getOwnerById,likeFood , saveFood , getSavedFood, deleteComment, getComments, postComment, getOwnerProfile} from "../controllers/user.controllers.js"

const userRouter=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update-location",isAuth,updateUserLocation)
userRouter.get("/search-items",isAuth,searchItems)
userRouter.get("/reels",isAuth,getReels)
userRouter.get("/owner-profile/:id",isAuth,getOwnerById)
userRouter.post("/like",isAuth,likeFood)
userRouter.post("/save",isAuth,saveFood)
userRouter.get("/saved-food",isAuth,getSavedFood)
userRouter.get("/comments/:reelId", isAuth, getComments);
userRouter.post("/comments", isAuth, postComment);
userRouter.delete("/comments/:id", isAuth, deleteComment);
userRouter.get("/owner-profile/:id", isAuth, getOwnerProfile);
userRouter.get("/owner-data/:id", isAuth, getOwnerById);

export default userRouter