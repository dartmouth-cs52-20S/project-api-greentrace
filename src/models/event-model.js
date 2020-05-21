import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  // sourceUser: { type: Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const EventModel = mongoose.model('Event', PostSchema);

export default EventModel;
