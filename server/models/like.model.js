import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  likedAt: { type: Date, default: Date.now }
});

likeSchema.index({ blogId: 1 });
likeSchema.index({ userId: 1 });
likeSchema.index({ blogId: 1, userId: 1 }, { unique: true }); // Prevent duplicate likes

export const Like = mongoose.model('Like', likeSchema);
