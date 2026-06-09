import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String,
});

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  primaryDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ['male', 'female', 'other', 'unknown'], default: 'unknown' },
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  medicalHistory: [{ type: String }],
  allergies: [{ type: String }],
  chronicConditions: [{ type: String }],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

patientSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

patientSchema.index({ userId: 1 }, { unique: true });
patientSchema.index({ bloodType: 1, gender: 1, active: 1 });
patientSchema.index({ medicalHistory: 'text', allergies: 'text', chronicConditions: 'text' });

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
