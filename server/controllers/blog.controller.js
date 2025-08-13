import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js"
import { uploadOnImageKit } from "../utils/imageKit.js";
import { Like } from "../models/like.model.js"

const fetchAllBlogs = asyncHandler(async (req, res) => {
    const allVisibleBlogs = await Blog.find({ blogVisibility: true })
        .sort({ createdAt: -1 })
        .populate({
            path: "blogAuthor",
            select: "username avatar"
        }).lean();
    const likedBlogs = await Like.find({ userId: req.user._id }).select('blogId').lean();
    const likedIds = new Set(likedBlogs.map(like => like.blogId.toString()));

    allVisibleBlogs.forEach(blog => {
        blog.isLiked = likedIds.has(blog._id.toString());
    })

    return res.status(200).json(new ApiResponse(200, "All visible blogs fetched successfully", allVisibleBlogs));
});

const createBlog = asyncHandler(async (req, res) => {
    // Logic to create a new blog
    const { blogTitle, blogSlug, blogContent, blogCategory, blogTags } = req.body;
    const blogAuthor = req.user._id;


    const requiredFields = [
        blogTitle,
        blogSlug,
        blogContent,
        blogCategory,
    ];

    if (requiredFields.some(field => !field || field.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    if (!req.file || req.file.length === 0) throw new ApiError(400, "Blog Cover Image not provided")
    const blogCoverImagePath = req.file.path;
    const uploadResult = await uploadOnImageKit(blogCoverImagePath);

    const createdBlog = await Blog.create({
        blogTitle,
        blogSlug,
        blogCoverImage: uploadResult.url,
        blogContent,
        blogCategory,
        blogAuthor,
        blogTags
    });

    if (!createdBlog) {
        throw new ApiError(400, 'Blog creation failed');
    }

    res.status(201).json(new ApiResponse(201, 'Blog created successfully', createdBlog));
});

const editBlog = asyncHandler(async (req, res) => {
    const { blogSlug: oldSlug } = req.params;
    const {
        blogTitle,
        blogSlug: newSlug,
        blogContent,
        blogCategory,
        blogTags = [],
        blogVisibility
    } = req.body;

    const blogAuthor = req.user._id;

    // 1️⃣ Find existing blog first
    const existingBlog = await Blog.findOne({ blogSlug: oldSlug });
    if (!existingBlog) {
        throw new ApiError(404, 'Blog not found');
    }

    // 2️⃣ Validate required fields
    const requiredFields = [blogTitle, newSlug, blogContent, blogCategory];
    if (requiredFields.some(field => !field || field.trim() === "")) {
        throw new ApiError(400, 'All fields are required');
    }

    // 3️⃣ Check slug uniqueness only if it changed
    if (newSlug !== existingBlog.blogSlug) {
        const slugTaken = await Blog.findOne({ blogSlug: newSlug });
        if (slugTaken) {
            throw new ApiError(400, 'Slug already in use by another blog');
        }
    }

    // 4️⃣ Handle cover image upload
    let blogCoverImageUrl = existingBlog.blogCoverImage; // keep old by default
    if (req.file) {
        const blogCoverImagePath = req.file.path;
        const uploadResult = await uploadOnImageKit(blogCoverImagePath);
        blogCoverImageUrl = uploadResult.url;
    }

    // 5️⃣ Clean tags (remove empty/whitespace entries)
    const cleanedTags = Array.isArray(blogTags)
        ? blogTags.filter(tag => tag.trim() !== "")
        : [];

    // 6️⃣ Update in one atomic query
    const updatedBlog = await Blog.findOneAndUpdate(
        { blogSlug: oldSlug },
        {
            blogTitle,
            blogSlug: newSlug,
            blogCoverImage: blogCoverImageUrl,
            blogContent,
            blogCategory,
            blogAuthor,
            blogTags: cleanedTags,
            blogVisibility
        },
        { new: true, runValidators: true }
    );

    res.status(200).json(
        new ApiResponse(200, 'Blog updated successfully', updatedBlog)
    );
});
// TODO:: see best practices for edit controllers

const changeBlogVisibility = asyncHandler(async (req, res) => {
    // Logic to change blog visibility from public to private or vice versa
    const { blogSlug, blogId } = req.params;
    if (!blogId && !blogSlug) {
        throw new ApiError(400, "Provide Blog Slug or Blog Id");
    }


    const blog = await Blog.findOneAndUpdate(
        { $or: [{ _id: blogId }, { blogSlug }] },
        [{ $set: { blogVisibility: { $not: "$blogVisibility" } } }],
        { new: true, }
    )
    if (!blog) throw new ApiError(404, "Blog not found");
    return res.status(200).json(new ApiResponse(201, "Blog visibilty changed successfully", blog))
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId, blogSlug } = req.params;
    if (!blogId && !blogSlug) {
        throw new ApiError(400, "Provide Blog Slug or Blog Id");
    }
    const blog = await Blog.findOne({ $or: [{ _id: blogId }, { blogSlug }] })
    if (!blog) throw new ApiError(400, "Blog not found");
    await Blog.deleteOne({ _id: blog._id });
    res.status(200).json(new ApiResponse(200, 'Blog deleted successfully', null));
});

const getBlogBySlugOrId = asyncHandler(async (req, res) => {
    const { blogSlug, blogId } = req.params;
    if (!blogId && !blogSlug) {
        throw new ApiError(400, "Provide Blog Slug or Blog Id");
    }

    const blog = await Blog.findOne({
        $or: [{ _id: blogId }, { blogSlug }]
    })
        .populate({
            path: 'blogAuthor',
            select: 'username avatar',
            options: { lean: true }
        })
        .lean();

    if (!blog) throw new ApiError(404, "Blog not found");

    const isLiked = await Like.exists({
        userId: req.user._id,
        blogId: blog._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "Blog found successfully", { ...blog, isLiked }));
});


const getUserBlogs = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const loggedInUser = req.user;

    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const userId = user._id;
    let query = { blogAuthor: userId };

    // If this is NOT the logged-in user's own blogs, show only visible blogs
    if (!loggedInUser || loggedInUser._id.toString() !== userId.toString()) {
        query.blogVisibility = true;
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).populate({
        path: 'blogAuthor',
        select: 'username avatar'
    }).lean();

    if (!blogs.length) {
        return res.status(200).json(new ApiResponse(200, "No blogs found", []));
    }

    const likedBlogs = await Like.find({ userId }).select('blogId').lean();
    const likedIds = new Set(likedBlogs.map(like => like.blogId.toString()));
    blogs.forEach(blog => {
        blog.isLiked = likedIds.has(blog._id.toString());
    })

    return res.status(200).json(new ApiResponse(200, "Blogs found successfully", blogs));
});

export {
    fetchAllBlogs,
    createBlog,
    deleteBlog,
    changeBlogVisibility,
    editBlog,
    getBlogBySlugOrId,
    getUserBlogs
}

