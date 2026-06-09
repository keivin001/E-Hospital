import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  permissions: [{ type: String }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

roleSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model('Role', roleSchema);
export default Role;
