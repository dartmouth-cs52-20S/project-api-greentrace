import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
  tested: { type: Boolean },
  covid: { type: Boolean },
  contactDate: { type: Number },
  userID: { type: String },
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

MessageSchema.virtual('content').get(function getContent() {
  if (this.covid) {
    if (this.tested) {
      // covid, tested
      return `A student you were last in contact with on ${new Date(this.contactDate).toDateString()} has been tested (as previously alerted) and diagnosed with COVID-19.
We recommend checking your symptoms and scheduling an appointment to get tested at Dick’s House or DHMC.`;
    } else {
      // covid, !tested
      return `A student you were last in contact with on ${new Date(this.contactDate).toDateString()} has been tested and diagnosed with COVID-19.
We recommend checking your symptoms and scheduling an appointment to get tested at Dick’s House or DHMC.`;
    }
  } else if (this.tested) {
    // !covid, tested
    return `A student you were last in contact with on ${new Date(this.contactDate).toDateString()} is being tested for COVID-19.
We recommend checking your symptoms and checking back here for more information soon.`;
  } else {
    // !covid, !tested
    return '';
  }
});

const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;
