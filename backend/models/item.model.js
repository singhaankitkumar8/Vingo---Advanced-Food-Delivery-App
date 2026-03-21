import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required:true,
      min: 0
    },
    category: {
      type: String,
      required: true,
       enum: [
        "Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others"
      ]
    },
    image: {
      type: String, // Image URL
      default: ""
    },
    video:{
      type: String,
      default:"",  //Vidoe URL
    },
    description:{
      type: String,
    },
    availability: {
      type: Boolean,
      default: true
    },
    rating: {
      average: { 
        type: Number, 
        default: 0 
      },
      count: { 
        type: Number, 
        default: 0 
      }
    },
    type:{
     type: String,
     enum:["veg","non veg"]
  },
  likeCount:{
    type: Number,
    default: 0,
  },
  saveCount:{
    type: Number,
    default: 0,
  },
  commentCount:{
    type: Number,
    default: 0,
  }
  },
  
  { timestamps: true }
);

 const Item = mongoose.model("Item", itemSchema);
 export default Item
