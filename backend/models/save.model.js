import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
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
    
  },
  
  { timestamps: true }
);

 const Save = mongoose.model("Save", saveSchema);
 export default Save
