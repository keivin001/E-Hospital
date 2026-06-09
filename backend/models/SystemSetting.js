import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  active: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
});

systemSettingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);
export default SystemSetting;
