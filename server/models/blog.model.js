import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        blogTitle: {
            type: String,
            required: true,
        },
        blogSlug: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        blogCoverImage: {
            type: String,
            required: true,
        },
        blogContent: {
            type: String,
            required: true,
        },
        blogCategory: {
            type: String,
            required: true,
        },
        blogAuthor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        blogTags: {
            type: [String],
        },
        blogVisibility: {
            type: Boolean,
            default: true
        },
        likeCount: { type: Number, default: 0 },
        commentCount: { type: Number, default: 0 },
        viewCount: { type: Number, default: 0 },

    }, { timestamps: true }
)

export const Blog = mongoose.model("Blog", blogSchema);