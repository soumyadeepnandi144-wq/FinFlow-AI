const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: [true, 'Invoice is required'],
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    decision: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'returned'],
      default: 'pending',
      required: true,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    decisionDate: Date,
    approvalLevel: {
      type: Number,
      default: 1,
      min: [1, 'Approval level must be at least 1'],
      required: true,
      validate: {
        validator: Number.isInteger,
        message: 'Approval level must be a whole number',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
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

approvalSchema.pre('validate', function () {
  if (!this.isModified('decision')) return;

  if (this.decision === 'pending') {
    this.decisionDate = undefined;
  } else if (!this.isModified('decisionDate') || !this.decisionDate) {
    this.decisionDate = new Date();
  }
});

approvalSchema.index(
  { invoice: 1, approvalLevel: 1, reviewer: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);
approvalSchema.index({ reviewer: 1, isActive: 1, decision: 1 });
approvalSchema.index({ decisionDate: -1 });

module.exports = mongoose.model('Approval', approvalSchema);