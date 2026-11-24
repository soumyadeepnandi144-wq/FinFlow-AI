const mongoose = require('mongoose');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
      minlength: [2, 'Vendor name must be at least 2 characters'],
      maxlength: [150, 'Vendor name cannot exceed 150 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => !v || EMAIL_REGEX.test(v),
        message: 'Invalid email address',
      },
    },
    taxId: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [30, 'Tax ID cannot exceed 30 characters'],
    },
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

vendorSchema.index({ name: 1 });
vendorSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);