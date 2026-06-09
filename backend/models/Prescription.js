import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending', enum: ['pending', 'active', 'expired', 'revoked', 'rejected'] },
  items: [
    {
      name: { type: String, required: true },
      dosage: String,
      frequency: String,
      duration: String,
      notes: String,
    },
  ],
  issueDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
