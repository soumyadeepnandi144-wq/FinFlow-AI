const mongoose = require('mongoose');

const ACTIONS = [
  'login',
  'logout',
  'create',
  'update',
  'delete',
  'upload',
  'download',
  'verify',
  'approve',
  'reject',
  'payment_status_change',
  'system_action',
];

const ENTITY_TYPES = [
  'User',
  'Vendor',
  'Invoice',
  'PurchaseOrder',
  'GoodsReceipt',
  'Approval',
  'System',
];

const truncate = (max) => (value) =>
  typeof value === 'string' ? value.trim().slice(0, max) : value;

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      enum: ACTIONS,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: ENTITY_TYPES,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      set: truncate(45),
    },
    userAgent: {
      type: String,
      set: truncate(500),
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

auditLogSchema.pre('save', async function () {
  if (!this.isNew) {
    throw new Error('Audit logs cannot be modified');
  }
});

auditLogSchema.pre(
  ['updateOne', 'updateMany', 'findOneAndUpdate', 'replaceOne', 'findOneAndReplace'],
  async function () {
    throw new Error('Audit logs cannot be modified');
  }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);