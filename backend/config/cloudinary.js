// import { v2 as cloudinary } from 'cloudinary'
// import fs from "fs"
// const uploadOnCloudinary = async (file)=>{
//     try {
//          cloudinary.config({ 
//             cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//             api_key:process.env.CLOUDINARY_API_KEY, 
//             api_secret:process.env.CLOUDINARY_API_SECRET
// });
// const result = await cloudinary.uploader
//   .upload(file)
// fs.unlinkSync(file)
// return result.secure_url
//     } catch (error) {
//         fs.unlinkSync(file)
//         console.log(error)
//     }
   
// }

// export default uploadOnCloudinary


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath, resourceType = "image") => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType, // 🔥 FIX
    });

    fs.unlinkSync(filePath); // delete after success

    return result.secure_url;
  } catch (error) {
    console.log("Cloudinary Error:", error);

    // ⚠️ don't delete here for debugging if error happen
    fs.unlinkSync(filePath);

    throw new Error(error.message);
  }
};

export default uploadOnCloudinary;