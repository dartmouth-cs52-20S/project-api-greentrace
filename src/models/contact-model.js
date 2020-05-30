import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
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
  duration: { type: Number },
  danger: { type: Boolean },
  // primaryUser: { type: Schema.Types.ObjectId, ref: 'User' },
  // contactedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  primaryUser: { type: String },
  contactedUser: { type: String },
  initialContactTime: { type: Number },
  endContactTime: { type: Number },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const ContactModel = mongoose.model('Contact', ContactSchema);

export default ContactModel;
