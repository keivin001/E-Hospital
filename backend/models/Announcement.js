import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRoles: [{ type: String }],
  targetUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  broadcast: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

announcementSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

announcementSchema.index({ targetRoles: 1 });
announcementSchema.index({ broadcast: 1, status: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
