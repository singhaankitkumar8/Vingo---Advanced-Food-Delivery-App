import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import Like from "../models/likes.model.js";
import Save from "../models/save.model.js";
import Comment from "../models/comment.model.js";
import mongoose from "mongoose";
import Order from "../models/order.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    // console.log("get current")
    const userId = req.userId;
    // console.log("userid",userId)
    const user = await User.findById(userId);
    // console.log(user)
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

// controllers/location.controller.j
export const updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    //console.log(req.body)
    const userId = req.userId; // JWT middleware se

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    // DB me user ki location update karo
    await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true },
    );

    // Socket se broadcast karo (agar real-time chahiye)
    const io = req.app.get("io");
    if (io) {
      io.emit("user:location:update", {
        userId,
        latitude,
        longitude,
        at: new Date(),
      });
    }

    return res.json({
      success: true,
      message: "Location updated",
    });
  } catch (err) {
    console.error("Update location error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    console.log(query);
    console.log(city);
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // पहले उस city के सारे shop IDs निकालो
    const shopsInCity = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (shopsInCity.length === 0) {
      return res.status(200).json([]); // उस city में कोई shop नहीं
    }

    const shopIds = shopsInCity.map((s) => s._id);

    // अब उन shops के अंदर items filter करो जो query से match करें
    const items = await Item.find({
      shop: { $in: shopIds },
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).populate("shop", "name city state");

    return res.status(200).json(items);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: `Search error: ${error.message}` });
  }
};

export const getReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;

    const foodItems = await Item.find({ video: { $exists: true, $ne: "" } })
      .populate("shop")
      .sort({ likeCount: -1, createdAt: -1 })
      .skip(page * 50)
      .limit(50);

    res.status(200).json({ foodItems });
  } catch (err) {
    console.error("Error fetching reels:", err);
    res.status(500).json({ message: "Server error fetching reels" });
  }
};

export const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 1️⃣ Owner info
    const owner = await User.findById(id).select("-password");
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // 🔹 2️⃣ Shops owned by this owner
    const shops = await Shop.find({ owner: id });
    const shopIds = shops.map(shop => shop._id);

    // Count all users with role 'user'
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 🔹 3️⃣ Items for these shops
    const items = await Item.find({ shop: { $in: shopIds } })
                            .populate("shop")
                            .sort({ createdAt: -1 });

    // 🔹 4️⃣ Calculate totalMeals as total items added
    const totalMeals = items.length;

    // 🔹 5️⃣ Calculate customersServed from delivered orders
    const stats = await Order.aggregate([
      { $unwind: "$shopOrders" },
      {
        $match: {
          "shopOrders.owner": new mongoose.Types.ObjectId(id),
          "shopOrders.status": "delivered",
        },
      },
      {
        $group: {
          _id: "$user", // unique customer
        },
      },
      {
        $group: {
          _id: null,
          customersServed: { $sum: 1 }, // count of unique users
        },
      },
    ]);

    const customersServed = stats[0]?.customersServed || 0;

    // 🔹 6️⃣ Prepare final owner data
    const ownerData = {
      ...owner.toObject(),
      totalMeals,
      customersServed,
      totalUsers,
    };

    // 🔹 7️⃣ Send response
    res.status(200).json({
      owner: ownerData,
      items, // items include video URLs for frontend
    });

  } catch (error) {
    console.error("Error in getOwnerById:", error);
    res.status(500).json({ message: "Error fetching owner profile" });
  }
};

export const likeFood = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;

    console.log("userId:", userId);
    console.log("itemId:", itemId);

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    const existingLike = await Like.findOne({
      user: userId,
      item: itemId,
    });
    
    // 🔁 UNLIKE
    if (existingLike) {
      
      await Like.deleteOne({ _id: existingLike._id });

      await Item.findByIdAndUpdate(
        itemId,
        { $inc: { likeCount: -1 } },
        { new: true }
      );

      return res.json({ like: false });
    }

    // ❤️ LIKE
    
    await Like.create({
      user: userId,
      item: itemId,
    });

    await Item.findByIdAndUpdate(
      itemId,
      { $inc: { likeCount: 1 } },
      { new: true }
    );

    return res.json({ like: true });

  } catch (error) {

    console.log("Like error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const saveFood = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId;
  
    const isAlreadySaved = await Save.findOne({
      user: userId,
      item: itemId,
    });
  
    if (isAlreadySaved) {
      await Save.deleteOne({
        user: userId,
        item: itemId,
      });
  
      await Item.findByIdAndUpdate(itemId, {
        $inc: { saveCount: -1 },
      });
  
      return res.status(200).json({
        message: "Food unsaved successfully",
        save: false
      });
    }

    const save = await Save.create({
      user: userId,
      item: itemId,
    });

    await Item.findByIdAndUpdate(itemId, {
      $inc: { saveCount: 1 },
    });

    res.status(201).json({
      message: "Food saved successfully",
      save: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Error saving/unsaving food",
    });
  }
};

export const getSavedFood = async (req, res) => {
  try {
    const userId = req.userId;
  
    const savedFoods = await Save.find({ user: userId }).populate("item");
  
    if (!savedFoods || savedFoods.length === 0) {
      return res.status(404).json({ message: "No saved foods found" });
    }
  
    res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods: savedFoods || [],
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error in retrieving Saved foods",
    });
  }
};

export const postComment = async (req, res) => {
  try {
    const { reelId, text } = req.body;

    console.log("BODY:", req.body);
    console.log("USER:", req.userId);

    const newComment = await Comment.create({
      user: req.userId,
      item: reelId,
      comment: text,
    });

    await Item.findByIdAndUpdate(reelId, {
      $inc: { commentsCount: 1 },
    });

    await newComment.populate("user", "fullName"); // 🔥 useful for UI
    
    res.status(201).json(newComment);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
  

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // ✅ ownership check
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(id);

    await Item.findByIdAndUpdate(comment.item, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { reelId } = req.params;

    const comments = await Comment.find({ item: reelId })
      .populate("user", "fullName") // ✅ add user info
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};




export const getOwnerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // 👤 Owner
    const owner = await User.findById(id).select("-password");
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // 🏪 Shop
    const shop = await Shop.findOne({ owner: id });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // 🎥 Items
    const items = await Item.find({ shop: shop._id }).sort({ createdAt: -1 });

    // 📊 Stats
    let totalLikes = 0;
    let totalComments = 0;

    items.forEach((item) => {
      totalLikes += item.likeCount;
      totalComments += item.commentCount ;
    });

    // 🔥 Top Reel (based on likeCount)
    let topReel = null;

    if (items.length > 0) {
      topReel = items.reduce((prev, curr) =>
        (curr.likeCount || 0) > (prev.likeCount || 0) ? curr : prev
      );
    }

    // 🚀 Response
    res.status(200).json({
      owner,
      items,
      totalLikes,
      totalComments,
      topReel,
    });

  } catch (err) {
    console.log("Owner Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};