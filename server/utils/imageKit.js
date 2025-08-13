import ImageKit from "imagekit";
import fs from "fs";
import path from "path";
import { ApiError } from "./ApiError.js";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadOnImageKit = async (localFilePath) => {
  if (!localFilePath) throw new ApiError(400, "Local File Path not provided");

  try {
    // Read file as Buffer
    const fileData = fs.readFileSync(localFilePath);

    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: fileData, // pass buffer
      fileName: path.basename(localFilePath),
      tags: ["blog", "cover"],
    });

    return uploadResult;
  } catch (error) {
    throw new ApiError(500, "Image upload failed", error);
  } finally {
    try {
      fs.unlinkSync(localFilePath); // delete temp file after upload
    } catch (err) {
      console.warn("Failed to delete temp file:", err.message);
    }
  }
};
