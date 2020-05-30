import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
  locationDifference: { type: Number },
  duration: { type: Number },
  danger: { type: Boolean },
  primaryUser: { type: Schema.Types.ObjectId, ref: 'User' },
  contactedUser: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

const ContactModel = mongoose.model('Contact', ContactSchema);

export default ContactModel;
