import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followedAt: { type: Date, default: Date.now }
});

followSchema.index({ followerId: 1 });
followSchema.index({ followeeId: 1 });
followSchema.index({ followerId: 1, followeeId: 1 }, { unique: true }); // Prevent duplicate follows

export const Follow = mongoose.model('Follow', followSchema);
