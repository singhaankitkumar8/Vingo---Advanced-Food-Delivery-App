import uploadOnCloudinary from "../config/cloudinary.js";
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";


export const addItem=async (req,res) => {
    try {
        const {name,category,type,price,description}=req.body
        const shop=await Shop.findOne({owner:req.userId})
        if(!shop){
            return res.status(400).json({message:"Shop not found"})
        }



        let image,video;
        if(req.files?.image){
            image=await uploadOnCloudinary(req.files.image[0].path)
        }else{
            return res.status(400).json({message:"image is required"})
        }

        if(req.files?.video){
            video = await uploadOnCloudinary(req.files.video[0].path,"video")
        }else{
            return res.status(400).json({message:"Video is required"})
        }

        const item=await Item.create({
            name,
            category,
            type,
            image,
            video,
            price,
            description,
            shop:shop._id
        })

        shop.items.push(item._id)
        
        await shop.save()
        await shop.populate({
        path: "items",
        options: { sort: { createdAt: -1 } }
      });
        await item.populate("shop")
        return res.status(201).json({ shop,item })

    } catch (error) {
        return res.status(500).json({message:`add item error ${error}`})
    }
}

export const getItemsByShop=async (req,res)=>{
    try {
        const {shopId}=req.params
        const items=await Item.find({shop:shopId}).populate("shop")
        if(!items.length){
           return res.status(400).json({message:"this shop does not have food items"}) 
        }
        return res.status(200).json(items)
    } catch (error) {
         return res.status(500).json({message:`get item error ${error}`})
    }
}



export const getItemsByCity = async (req, res) => {
  try {
    const city = req.params.city
     // e.g., ?city=Mumbai
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // Find all active shops in this city
    const shopsInCity = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    });

    if (!shopsInCity.length) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    const shopIds = shopsInCity.map((shop) => shop._id);

    // Find items for these shops
    const items = await Item.find({ shop: { $in: shopIds }, availability: true });
   return res.status(200).json(items);
  } catch (error) {
   return res.status(500).json({ message: "Server error" });
  }
};




export const getItemById=async (req,res) => {
    try {
        const {itemId}=req.params
        const item=await Item.findById(itemId)
        if(!item){
            return res.status(400).json({message:"item not found"})
        }
        return res.status(200).json(item)
    } catch (error) {
         return res.status(500).json({message:`get item error ${error}`})
    }
}

export const editItem=async (req,res) => {
    try {
        const {name,category,type,price,description}=req.body
        const {itemId}=req.params
       
        let image,video;

        if(req.files?.image){
            image = await uploadOnCloudinary(req.files.image[0].path)
        }

        if(req.files?.video){
            video = await uploadOnCloudinary(req.files.video[0].path,"video")
        }

        const item = await Item.findByIdAndUpdate(itemId,{
            name,category,type,price,image,video,description
         },{new:true})
        
         
        if(!item){
            return res.status(400).json({message:"item not found"})
        }
        await item.populate("shop")
        return res.status(200).json(item)

    } catch (error) {
        return res.status(500).json({message:`edit item error ${error}`})
    }
}




export const deleteItem=async (req,res) => {
    try {
        const {itemId}=req.params
        const item = await Item.findByIdAndDelete(itemId)
        if(!item){
        return res.status(400).json({message:"item not found"})
        }
        const shop=await Shop.findOne({owner:req.userId})
        shop.items = shop.items.filter(i=>i.toString() !== item._id.toString())

        // await Shop.findOneAndUpdate(
        //     { owner: req.userId },
        //     { $pull: { items: itemId } },
        //     { new: true }
        // );
        await shop.save()
        await shop.populate({
        path: "items",
        options: { sort: { createdAt: -1 } }
      });
      //console.log(shop)
      return res.status(201).json({ shop,item })

    } catch (error) {
        return res.status(500).json({message:`delete item error ${error}`})
    }
}


export const rating = async (req,res) => {
    try {
        const {itemId,rating } = req.body

        if(!itemId || !rating){
            return res.status(400).json({message:"ItemId and rating is required"})
        }
        if(rating<1 || rating>5){
            return res.status(400).json({message:"Rating must be between 1 to 5"})
        }

        const item = await Item.findById(itemId)

        if(!item){
            return res.status(400).json({message:"Item Not found"})
        }

        const newCount = item.rating.count + 1
        const newAverage = (item.rating.average*item.rating.count + rating)/newCount

        item.rating.count = newCount
        item.rating.average = newAverage

        await item.save()
        return res.status(200).json({rating:item.rating})
    } catch (error) {
        return res.status(400).json({message:"Rating error"})
    }
}