const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters'],
  },
  quantity: {
    type: Number,
    min: [0, 'Quantity cannot be negative'],
  },
  unitPrice: {
    type: Number,
    min: [0, 'Unit price cannot be negative'],
  },
  taxAmount: {
    type: Number,
    min: [0, 'Tax amount cannot be negative'],
    default: 0,
  },
  totalPrice: {
    type: Number,
    min: [0, 'Total price cannot be negative'],
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [100, 'Invoice number cannot exceed 100 characters'],
    },
    invoiceDate: Date,
    dueDate: Date,
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    },
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
    },
    extractedVendorName: {
      type: String,
      trim: true,
      maxlength: [150, 'Vendor name cannot exceed 150 characters'],
    },
    items: {
      type: [invoiceItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      min: [0, 'Subtotal cannot be negative'],
    },
    taxAmount: {
      type: Number,
      min: [0, 'Tax amount cannot be negative'],
    },
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
      maxlength: [10, 'Currency code cannot exceed 10 characters'],
    },
    document: {
      originalName: { type: String, trim: true, maxlength: 255 },
      storagePath: { type: String, trim: true, select: false },
      mimeType: { type: String, trim: true, default: 'application/pdf' },
      uploadedAt: { type: Date, default: Date.now },
    },
    extraction: {
      status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
        required: true,
      },
      model: { type: String, trim: true },
      confidence: { type: Number, min: 0, max: 1 },
      processedAt: Date,
      rawData: { type: mongoose.Schema.Types.Mixed, select: false },
      errorMessage: { type: String, trim: true, maxlength: 1000 },
    },
    verification: {
      vendorStatus: {
        type: String,
        enum: ['pending', 'verified', 'mismatch', 'unverified'],
        default: 'pending',
        required: true,
      },
      duplicateStatus: {
        type: String,
        enum: ['pending', 'clear', 'duplicate', 'possible_duplicate'],
        default: 'pending',
        required: true,
      },
      matchingStatus: {
        type: String,
        enum: ['pending', 'matched', 'partial_match', 'mismatch', 'not_applicable'],
        default: 'pending',
        required: true,
      },
      anomalyStatus: {
        type: String,
        enum: ['pending', 'clear', 'flagged'],
        default: 'pending',
        required: true,
      },
      remarks: {
        type: String,
        trim: true,
        maxlength: [2000, 'Verification remarks cannot exceed 2000 characters'],
      },
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['not_ready', 'ready_for_payment', 'paid', 'on_hold'],
      default: 'not_ready',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        if (ret.document) delete ret.document.storagePath;
        if (ret.extraction) delete ret.extraction.rawData;
        return ret;
      },
    },
  }
);

invoiceSchema.index({ vendor: 1, invoiceNumber: 1 });
invoiceSchema.index({ purchaseOrder: 1 });
invoiceSchema.index({ approvalStatus: 1, createdAt: -1 });
invoiceSchema.index({ paymentStatus: 1, dueDate: 1 });
invoiceSchema.index({ 'extraction.status': 1 });
invoiceSchema.index({ 'verification.duplicateStatus': 1 });
invoiceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);