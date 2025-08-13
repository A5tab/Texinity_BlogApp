import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/JWT.js";
import {User} from "../models/user.model.js";
export const authMiddleware = asyncHandler(async (req, _, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
        
        if (!accessToken) {
            throw new ApiError(401, "Access Token is missing")
        }
        const decodedToken = verifyAccessToken(accessToken);

        const user = await User.findById(decodedToken.id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid Token or Expired Token")
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
})