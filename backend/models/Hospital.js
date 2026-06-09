import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  email: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
