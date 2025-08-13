import mongoose from 'mongoose'
const commentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})
commentSchema.index({ blogId: 1})
commentSchema.index({ userId: 1})

export const Comment = mongoose.model('Comment', commentSchema)