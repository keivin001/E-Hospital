import mongoose from 'mongoose';

const labResultSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  value: String,
  unit: String,
  normalRange: String,
  notes: String,
});

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  url: String,
});

const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  reportType: {
    type: String,
    enum: ['diagnosis', 'treatment', 'laboratory', 'referral', 'summary'],
    default: 'diagnosis',
  },
  diagnosis: { type: String, required: true },
  treatmentPlan: { type: String },
  notes: { type: String },
  labResults: [labResultSchema],
  attachments: [attachmentSchema],
  status: { type: String, enum: ['draft', 'finalized', 'archived'], default: 'finalized' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

medicalRecordSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

medicalRecordSchema.index({ patientId: 1, doctorId: 1 });
medicalRecordSchema.index({ diagnosis: 'text', treatmentPlan: 'text', notes: 'text' });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
