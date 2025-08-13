import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Comment } from '../models/comment.model.js';
import { Blog } from "../models/blog.model.js"
import { User } from "../models/user.model.js"

const addComment = asyncHandler(async (req, res) => {
    const { blogId, comment } = req.body;
    const userId = req.user._id;

    if (!comment || !blogId) {
        throw new ApiError(400, 'All fields are required');
    }

    const addedComment = await Comment.create({ comment, blogId, userId });

    if (!addedComment) {
        throw new ApiError(400, 'Comment creation failed');
    }

    let updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $inc: { commentCount: 1 } },
        { new: true }
    );

    if (!updatedBlog) {
        throw new ApiError(404, 'Blog not found');
    }

    updatedBlog = await updatedBlog.populate('blogAuthor', 'username avatar');
    const populatedComment = await addedComment.populate('userId', 'username avatar');

    return res.status(201).json(
        new ApiResponse(201, 'Comment added successfully', {
            comment: populatedComment,
            updatedBlog
        })
    );
});


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;
    if (!commentId) throw new ApiError(400, "Comment Id not provided");

    const comment = await Comment.findById(commentId)
    if (!comment) throw new ApiError(404, "Comment not found");

    if (!comment.userId.equals(userId)) throw new ApiError(403, "You are not authorized to delete this comment.");

    await Comment.findByIdAndDelete(commentId);

    const updatedBlog = await Blog.findByIdAndUpdate(comment.blogId, { $inc: { commentCount: -1 } }, { new: true });

    return res.status(200).json(new ApiResponse(200, "Comment deleted from blog successfully", updatedBlog));

})

const updateComment = asyncHandler(async (req, res) => {
    const { newComment } = req.body;
    const { commentId } = req.body;
    const userId = req.user._id;

    if (!commentId) throw new ApiError(400, "Comment ID not provided");
    if (!newComment) throw new ApiError(400, "New comment content is required");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    if (!comment.userId.equals(userId)) {
        throw new ApiError(403, "You are not authorized to update this comment.");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { comment: newComment },
        { new: true }
    ).populate("userId", "username avatar");

    res.status(200).json(new ApiResponse(200, "Comment updated successfully", updatedComment));
});

const getBlogComments = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!blogId) throw new ApiError(400, "Blog ID not provided");

    const blogComments = await Comment.find({ blogId })
        .sort({ createdAt: -1 }) // newest first
        .populate("userId", "username avatar"); // optional: include commenter info

    return res.status(200).json(
        new ApiResponse(200, "Blog comments fetched successfully", blogComments)
    );
});

export {
    addComment,
    deleteComment,
    updateComment,
    getBlogComments
}

