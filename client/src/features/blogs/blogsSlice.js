
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBlogs,
  createBlog,
  editBlog,
  deleteBlog,
  // changeBlogVisibility,
  getBlogBySlugOrId,
  getUserBlogs,
  toggleLike
} from './thunks.js';
import { deleteComment, createComment } from '../comments/thunks.js';


const initialState = {
  blogs: [],
  userBlogs: [],
  singleBlog: null,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create blog
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload.data);
        state.userBlogs.push(action.payload.data);
      })

      // Edit blog
      .addCase(editBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog._id === action.payload.data._id);
        if (index !== -1) state.blogs[index] = action.payload.data;

        const userIndex = state.userBlogs.findIndex(blog => blog._id === action.payload.data._id);
        if (userIndex !== -1) state.userBlogs[userIndex] = action.payload.data;
      })

      // Change visibility
      // .addCase(changeBlogVisibility.fulfilled, (state, action) => {
      //   const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
      //   if (index !== -1) state.blogs[index] = action.payload;

      //   const userIndex = state.userBlogs.findIndex(blog => blog._id === action.payload._id);
      //   if (userIndex !== -1) state.userBlogs[userIndex] = action.payload;
      // })

      // Delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.userBlogs = state.userBlogs.filter(blog => blog._id !== action.payload);
      })

      // Get single blog
      .addCase(getBlogBySlugOrId.fulfilled, (state, action) => {
        state.singleBlog = action.payload.data;
      })

      // Get user blogs
      .addCase(getUserBlogs.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUserBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.userBlogs = action.payload.data;
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.error = null;
        state.blogs = state.blogs.map(blog => blog._id === action.payload.data._id ? { ...blog, isLiked: action.payload.data.isLiked, likeCount: action.payload.data.likeCount } : blog);
        state.userBlogs = state.userBlogs.map(blog => blog._id === action.payload.data._id ? { ...blog, isLiked: action.payload.data.isLiked, likeCount: action.payload.data.likeCount } : blog);
        state.singleBlog = state.singleBlog?._id === action.payload.data._id ? { ...state.singleBlog, isLiked: action.payload.data.isLiked, likeCount: action.payload.data.likeCount } : state.singleBlog;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.singleBlog = action.payload.data;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        if (state.singleBlog && state.singleBlog._id === action.payload.updatedBlog._id) {
          state.singleBlog.commentCount = action.payload.updatedBlog.commentCount;
        }
      });

  },
});

export default blogSlice.reducer;
