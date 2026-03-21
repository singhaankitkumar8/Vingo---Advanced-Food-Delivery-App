import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    comment:{
        type: String,
        required: true
    }
    
  },
  
  { timestamps: true }
);

 const Comment = mongoose.model("Comment", commentSchema);
 export default Comment
