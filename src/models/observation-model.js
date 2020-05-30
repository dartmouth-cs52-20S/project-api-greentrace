import mongoose, { Schema } from 'mongoose';

// from https://mongoosejs.com/docs/geojson.html

const ObservationSchema = new Schema({
  sourceUserID: { type: String }, // user._id
  dataCollectionTimestamp: { type: Number },
  dataExitTimestamp: { type: Number },
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

ObservationSchema.index({ location: '2dsphere' });
const EventModel = mongoose.model('Event', ObservationSchema);

export default EventModel;
