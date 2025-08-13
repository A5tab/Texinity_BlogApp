import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Blog } from "../models/blog.model.js";
import { Like } from "../models/like.model.js";

export const toggleLike = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    const userId = req.user._id;

    if (!blogId) throw new ApiError(400, "Blog Id not provided");

    // Check if already liked
    const existingLike = await Like.findOne({ blogId, userId });

    if (existingLike) {
        // Unlike
        await Like.deleteOne({ _id: existingLike._id });
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { likeCount: -1 } },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, "Unliked Successfully", {
                _id: blogId,
                isLiked: false,
                likeCount: updatedBlog.likeCount
            })
        );
    } else {
        // Like
        await Like.create({ blogId, userId });
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { $inc: { likeCount: 1 } },
            { new: true }
        );

        return res.status(200).json(
            new ApiResponse(200, "Liked Successfully", {
                _id: blogId,
                isLiked: true,
                likeCount: updatedBlog.likeCount
            })
        );
    }
});
