import mongoose, { Schema } from 'mongoose';

// from https://mongoosejs.com/docs/geojson.html

const ObservationSchema = new Schema({
  sourceUser: { type: String }, // email address
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

const EventModel = mongoose.model('Event', ObservationSchema);

export default EventModel;
