import mongoose from 'mongoose';

const validGenders = ['male', 'female', 'other', 'unknown'];
const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateEmergencyContact = (contact, errors) => {
  if (contact === undefined) return;
  if (typeof contact !== 'object' || Array.isArray(contact)) {
    errors.push('emergencyContact must be an object with name, relation, and phone');
    return;
  }

  if (contact.name && typeof contact.name !== 'string') {
    errors.push('emergencyContact.name must be a string');
  }
  if (contact.relation && typeof contact.relation !== 'string') {
    errors.push('emergencyContact.relation must be a string');
  }
  if (contact.phone && typeof contact.phone !== 'string') {
    errors.push('emergencyContact.phone must be a string');
  }
};

const validateAddress = (address, errors) => {
  if (address === undefined) return;
  if (typeof address !== 'object' || Array.isArray(address)) {
    errors.push('address must be an object with street, city, state, zip, and country');
    return;
  }

  if (address.street && typeof address.street !== 'string') {
    errors.push('address.street must be a string');
  }
  if (address.city && typeof address.city !== 'string') {
    errors.push('address.city must be a string');
  }
  if (address.state && typeof address.state !== 'string') {
    errors.push('address.state must be a string');
  }
  if (address.zip && typeof address.zip !== 'string') {
    errors.push('address.zip must be a string');
  }
  if (address.country && typeof address.country !== 'string') {
    errors.push('address.country must be a string');
  }
};

const validateStringArray = (value, fieldName, errors) => {
  if (value === undefined) return;
  if (!Array.isArray(value)) {
    errors.push(`${fieldName} must be an array of strings`);
    return;
  }

  value.forEach((item, index) => {
    if (typeof item !== 'string') {
      errors.push(`${fieldName}[${index}] must be a string`);
    }
  });
};

export const validatePatientCreate = (payload) => {
  const errors = [];

  if (!payload.userId || !isObjectId(payload.userId)) {
    errors.push('userId is required and must be a valid ObjectId');
  }

  if (payload.primaryDoctorId && !isObjectId(payload.primaryDoctorId)) {
    errors.push('primaryDoctorId must be a valid ObjectId');
  }

  if (payload.age === undefined || typeof payload.age !== 'number' || payload.age < 0) {
    errors.push('age is required and must be a number greater than or equal to 0');
  }

  if (payload.gender && !validGenders.includes(payload.gender)) {
    errors.push(`gender must be one of: ${validGenders.join(', ')}`);
  }

  if (payload.bloodType && !validBloodTypes.includes(payload.bloodType)) {
    errors.push(`bloodType must be one of: ${validBloodTypes.join(', ')}`);
  }

  if (payload.address) {
    validateAddress(payload.address, errors);
  }

  validateEmergencyContact(payload.emergencyContact, errors);
  validateStringArray(payload.medicalHistory, 'medicalHistory', errors);
  validateStringArray(payload.allergies, 'allergies', errors);
  validateStringArray(payload.chronicConditions, 'chronicConditions', errors);

  return errors;
};

export const validatePatientUpdate = (payload) => {
  const errors = [];

  if (payload.userId && !isObjectId(payload.userId)) {
    errors.push('userId must be a valid ObjectId');
  }

  if (payload.primaryDoctorId && !isObjectId(payload.primaryDoctorId)) {
    errors.push('primaryDoctorId must be a valid ObjectId');
  }

  if (payload.age !== undefined && (typeof payload.age !== 'number' || payload.age < 0)) {
    errors.push('age must be a number greater than or equal to 0');
  }

  if (payload.gender && !validGenders.includes(payload.gender)) {
    errors.push(`gender must be one of: ${validGenders.join(', ')}`);
  }

  if (payload.bloodType && !validBloodTypes.includes(payload.bloodType)) {
    errors.push(`bloodType must be one of: ${validBloodTypes.join(', ')}`);
  }

  if (payload.address) {
    validateAddress(payload.address, errors);
  }

  validateEmergencyContact(payload.emergencyContact, errors);
  validateStringArray(payload.medicalHistory, 'medicalHistory', errors);
  validateStringArray(payload.allergies, 'allergies', errors);
  validateStringArray(payload.chronicConditions, 'chronicConditions', errors);

  return errors;
};
