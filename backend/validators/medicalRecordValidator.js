import mongoose from 'mongoose';

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const validateMedicalRecordCreate = (payload) => {
  const errors = [];

  if (!payload.patientId || !isObjectId(payload.patientId)) {
    errors.push('patientId is required and must be a valid ObjectId');
  }

  if (!payload.doctorId || !isObjectId(payload.doctorId)) {
    errors.push('doctorId is required and must be a valid ObjectId');
  }

  if (!payload.diagnosis || typeof payload.diagnosis !== 'string') {
    errors.push('diagnosis is required and must be a string');
  }

  if (payload.reportType && !['diagnosis', 'treatment', 'laboratory', 'referral', 'summary'].includes(payload.reportType)) {
    errors.push('reportType must be one of diagnosis, treatment, laboratory, referral, summary');
  }

  if (payload.labResults !== undefined && !Array.isArray(payload.labResults)) {
    errors.push('labResults must be an array');
  }

  return errors;
};

export const validateMedicalRecordUpdate = (payload) => {
  const errors = [];

  if (payload.patientId && !isObjectId(payload.patientId)) {
    errors.push('patientId must be a valid ObjectId');
  }

  if (payload.doctorId && !isObjectId(payload.doctorId)) {
    errors.push('doctorId must be a valid ObjectId');
  }

  if (payload.diagnosis !== undefined && typeof payload.diagnosis !== 'string') {
    errors.push('diagnosis must be a string');
  }

  if (payload.reportType && !['diagnosis', 'treatment', 'laboratory', 'referral', 'summary'].includes(payload.reportType)) {
    errors.push('reportType must be one of diagnosis, treatment, laboratory, referral, summary');
  }

  if (payload.status && !['draft', 'finalized', 'archived'].includes(payload.status)) {
    errors.push('status must be one of draft, finalized, archived');
  }

  return errors;
};
