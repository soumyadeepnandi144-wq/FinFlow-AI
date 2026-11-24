const mongoose = require('mongoose');

const roundQty = (n) => Math.round(n * 10000) / 10000;

const goodsReceiptItemSchema = new mongoose.Schema({
  poItemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Purchase order item reference is required'],
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters'],
  },
  quantityReceived: {
    type: Number,
    required: [true, 'Received quantity is required'],
    min: [0.01, 'Received quantity must be greater than zero'],
  },
  quantityAccepted: {
    type: Number,
    default: 0,
    min: [0, 'Accepted quantity cannot be negative'],
  },
  quantityRejected: {
    type: Number,
    default: 0,
    min: [0, 'Rejected quantity cannot be negative'],
  },
});

goodsReceiptItemSchema.pre('validate', function () {
  if (!Number.isFinite(this.quantityReceived)) return;

  const accepted = this.quantityAccepted ?? 0;
  const rejected = this.quantityRejected ?? 0;

  if (!Number.isFinite(accepted) || !Number.isFinite(rejected)) return;

  if (roundQty(accepted + rejected) > roundQty(this.quantityReceived)) {
    this.invalidate(
      'quantityAccepted',
      'Accepted and rejected quantities cannot exceed received quantity'
    );
  }
});

const goodsReceiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, 'Goods receipt number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PurchaseOrder',
      required: [true, 'Purchase order is required'],
    },
    items: {
      type: [goodsReceiptItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Goods receipt must contain at least one item',
      },
    },
    receivedDate: {
      type: Date,
      required: [true, 'Received date is required'],
      default: Date.now,
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    deliveryNoteNumber: {
      type: String,
      trim: true,
      maxlength: [100, 'Delivery note number cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['draft', 'received', 'partially_accepted', 'accepted', 'rejected'],
      default: 'received',
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

goodsReceiptSchema.index({ purchaseOrder: 1, receivedDate: -1 });
goodsReceiptSchema.index({ status: 1 });
goodsReceiptSchema.index({ receivedDate: -1 });

module.exports = mongoose.model('GoodsReceipt', goodsReceiptSchema);
