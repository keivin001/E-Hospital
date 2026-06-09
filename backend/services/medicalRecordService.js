import MedicalRecord from '../models/MedicalRecord.js';

const buildMatchQuery = ({ doctorId, patientId, status, search }) => {
  const match = {};
  if (doctorId) match.doctorId = doctorId;
  if (patientId) match.patientId = patientId;
  if (status) match.status = status;
  if (search) match.$text = { $search: search };
  return match;
};

export const searchMedicalRecords = async ({ doctorId, patientId, status, search, page = 1, limit = 20 }) => {
  const match = buildMatchQuery({ doctorId, patientId, status, search });
  const skip = Math.max(0, page - 1) * limit;

  const total = await MedicalRecord.countDocuments(match);
  const records = await MedicalRecord.find(match)
    .populate('patientId doctorId createdBy updatedBy')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  return { records, total, page, limit };
};

export const getMedicalRecordById = (id) => {
  return MedicalRecord.findById(id).populate('patientId doctorId createdBy updatedBy');
};

export const createMedicalRecord = (payload) => {
  return MedicalRecord.create(payload);
};

export const updateMedicalRecord = (id, payload) => {
  return MedicalRecord.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('patientId doctorId createdBy updatedBy');
};

export const deleteMedicalRecord = (id) => {
  return MedicalRecord.findByIdAndDelete(id);
};

export const getRecordsByPatient = (patientId) => {
  return MedicalRecord.find({ patientId }).populate('patientId doctorId createdBy updatedBy');
};

export const getRecordsByDoctor = (doctorId) => {
  return MedicalRecord.find({ doctorId }).populate('patientId doctorId createdBy updatedBy');
};
