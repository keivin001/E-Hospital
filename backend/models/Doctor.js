import mongoose from 'mongoose';

const scheduleSlotSchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  specialty: { type: String, required: true },
  experience: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  about: { type: String, default: '' },
  availability: { type: Boolean, default: true },
  languages: [{ type: String }],
  certifications: [{ type: String }],
  schedule: [scheduleSlotSchema],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

doctorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

doctorSchema.index({ userId: 1 }, { unique: true });
doctorSchema.index({ specialty: 'text', about: 'text' });
doctorSchema.index({ hospitalId: 1, active: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
