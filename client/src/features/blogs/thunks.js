
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '../../api/axios.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

// fetch all blogs for feed 
export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    asyncHandler(async () => {
        const response = await axiosPrivate.get('/blogs/get-all-blogs');
        return response.data;
    })
);

// Create a new blog
export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    asyncHandler(async (blogData) => {
        const response = await axiosPrivate.post('/blogs/create-blog', blogData);
        return response.data;
    })
);

// Edit a blog
export const editBlog = createAsyncThunk(
    'blogs/editBlog',
    asyncHandler(async ({ blogSlug, data }) => {
        const response = await axiosPrivate.put(`/blogs/edit-blog/${blogSlug}`, data);
        return response.data;
    })
);

// Change blog visibility
// export const changeBlogVisibility = createAsyncThunk(
//     'blogs/changeBlogVisibility',
//     asyncHandler(async (blogSlug) => {
//         const response = await axiosPrivate.patch(`/blogs/change-blog-visibility/${blogSlug}`);
//         console.log(response.data);

//         return response.data;
//     })
// );

// Delete a blog

export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    asyncHandler(async (blogSlug) => {
        await axiosPrivate.delete(`/blogs/delete/${blogSlug}`);
        return blogSlug;
    })
);

// Get a single blog by slug or ID
export const getBlogBySlugOrId = createAsyncThunk(
    'blogs/getBlogBySlugOrId',
    asyncHandler(async (blogSlug) => {
        const response = await axiosPrivate.get(`/blogs/get-blog/${blogSlug}`);
        return response.data;
    })
);

// Get blogs of a user
export const getUserBlogs = createAsyncThunk(
    'blogs/getUserBlogs',
    asyncHandler(async (username) => {
        const response = await axiosPrivate.get(`blogs/user/${username}`);
        return response.data;
    })
);

export const toggleLike = createAsyncThunk(
    "likes/toggleLike",
    asyncHandler(async (blogId) => {
        const { data } = await axiosPrivate.post('/likes/toggle-like', { blogId }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return data;
    })
);