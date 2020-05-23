import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  traceID: { type: String },
  tested: { type: Boolean },
  symptomatic: { type: Boolean },
  covid: { type: Boolean },
}, {
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
});

const MessageModel = mongoose.model('User', MessageSchema);

export default MessageModel;
