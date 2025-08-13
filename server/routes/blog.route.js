import { Router } from 'express';

import {
    createBlog,
    deleteBlog,
    changeBlogVisibility,
    editBlog,
    getBlogBySlugOrId,
    getUserBlogs,
    fetchAllBlogs
} from '../controllers/blog.controller.js';

import { multerUpload } from '../middlewares/multer.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const blogsRouter = Router();

blogsRouter
    .route('/get-all-blogs')
    .get(authMiddleware, fetchAllBlogs);

blogsRouter
    .route('/create-blog')
    .post(authMiddleware, multerUpload.single("blogCoverImage"), createBlog);

blogsRouter
    .route('/edit-blog/:blogSlug')
    .put(authMiddleware, multerUpload.single("blogCoverImage"), editBlog);

blogsRouter
    .route('/change-blog-visibility/:blogSlug')
    .patch(authMiddleware, changeBlogVisibility);

blogsRouter
    .route('/delete/:blogSlug')
    .delete(authMiddleware, deleteBlog);
blogsRouter
    .route('/get-blog/:blogSlug')
    .get(authMiddleware, getBlogBySlugOrId);

blogsRouter
    .route('/user/:username')
    .get(authMiddleware, getUserBlogs);

export default blogsRouter;
