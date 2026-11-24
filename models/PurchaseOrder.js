const mongoose = require('mongoose');

const roundAmount = (n) => Math.round(n * 100) / 100;

const purchaseOrderItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [300, 'Item description cannot exceed 300 characters'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.01, 'Quantity must be greater than zero'],
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative'],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: [true, 'Purchase order number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor is required'],
    },
    items: {
      type: [purchaseOrderItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'Purchase order must contain at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      trim: true,
    },
    orderDate: {
      type: Date,
      required: [true, 'Order date is required'],
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
      validate: {
        validator(value) {
          return !value || !this.orderDate || value >= this.orderDate;
        },
        message: 'Expected delivery date cannot be before order date',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'issued', 'partially_received', 'completed', 'cancelled'],
      default: 'draft',
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

purchaseOrderSchema.pre('validate', function () {
  if (!Array.isArray(this.items) || this.items.length === 0) return;

  let orderTotal = 0;

  for (const item of this.items) {
    if (
      !Number.isFinite(item.quantity) ||
      !Number.isFinite(item.unitPrice)
    ) {
      return;
    }

    item.totalPrice = roundAmount(item.quantity * item.unitPrice);
    orderTotal += item.totalPrice;
  }

  this.totalAmount = roundAmount(orderTotal);
});

purchaseOrderSchema.index({ vendor: 1, orderDate: -1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);