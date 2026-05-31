import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: "profile_images",
      transformation: [
        { gravity: "face", height: 150, width: 150, crop: "thumb" },
        { radius: 20 },
        { quality: "auto" },
      ],
    });
    fs.unlinkSync(filePath);  // these  will delete the file which is presnt in the local storage of my system after uploading it to cloudinary

    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath);  // Ensure the file is deleted even if there's an error
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

export default uploadOnCloudinary;