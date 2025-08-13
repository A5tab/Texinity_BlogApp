import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Follow } from "../models/follow.model.js"

const followUser = asyncHandler(async (req, res) => {
    const { followeeId } = req.body || req.params;
    const followerId = req.user._id;

    if (followerId === followeeId) {
        throw new ApiError(400, "You cannot follow yourself");
    }

    const follow = await Follow.findOne({ followerId, followeeId });
    if (follow) {
        throw new ApiError(400, "You are already following this user");
    }

    await Follow.create({ followeeId, followerId });

    res.status(200).json(new ApiResponse(200, "Follow successful"));
})

const unFollowUser = asyncHandler(async (req, res) => {
    const { followeeId } = req.body || req.params;
    const followerId = req.user._id;

    const follow = await Follow.findOneAndDelete({ followerId, followeeId });
    if (!follow) {
        throw new ApiError(404, "You are not following this user");
    }

    res.status(200).json(new ApiResponse(200, "Unfollow successful"));
})


// TODO:
//  get user follower, get user followee using aggregation piplines
export {
    followUser,
    unFollowUser
}