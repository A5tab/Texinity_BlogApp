import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../api/axios.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


// Create Comment
export const createComment = createAsyncThunk(
    "comments/create",
    asyncHandler(async ({ blogId, comment }) => {
        const { data } = await axiosPrivate.post("comments/add-comment", { blogId, comment }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data.data;
    })
);

// Get All Comments for a Blog
export const getComments = createAsyncThunk(
    "comments/getByBlog",
    asyncHandler(async (blogId) => {
        const { data } = await axiosPrivate.get(`/comments/get-blog-comments/${blogId}`);
        return data;
    })
);

// Delete Comment
export const deleteComment = createAsyncThunk(
    "comments/delete",
    asyncHandler(async (commentId) => {
        console.log(commentId);

        const { data } = await axiosPrivate.delete(`comments/delete-comment/${commentId}`);
        return { commentId, ...data };
    })
);


// Update Comment
export const editComment = createAsyncThunk(
    "comments/update",
    asyncHandler(async ({ commentId, newComment }) => {
        const { data } = await axiosPrivate.put(`comments/update-comment`, { commentId, newComment },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return data;
    })
);


