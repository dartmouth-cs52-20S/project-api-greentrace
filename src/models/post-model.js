import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  tags: Array,
  content: String,
  coverUrl: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
