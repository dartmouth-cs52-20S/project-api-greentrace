import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  tags: Array,
  content: String,
  coverUrl: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
