import mongoose from 'mongoose';

const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

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

const validateSchedule = (schedule, errors) => {
  if (schedule === undefined) return;
  if (!Array.isArray(schedule)) {
    errors.push('schedule must be an array');
    return;
  }

  schedule.forEach((slot, index) => {
    if (typeof slot !== 'object' || Array.isArray(slot)) {
      errors.push(`schedule[${index}] must be an object`);
      return;
    }

    if (!slot.day || !validDays.includes(slot.day)) {
      errors.push(`schedule[${index}].day must be one of ${validDays.join(', ')}`);
    }
    if (!slot.start || typeof slot.start !== 'string') {
      errors.push(`schedule[${index}].start is required and must be a string`);
    }
    if (!slot.end || typeof slot.end !== 'string') {
      errors.push(`schedule[${index}].end is required and must be a string`);
    }
    if (slot.available !== undefined && typeof slot.available !== 'boolean') {
      errors.push(`schedule[${index}].available must be a boolean`);
    }
  });
};

export const validateDoctorCreate = (payload) => {
  const errors = [];

  if (!payload.userId || !isObjectId(payload.userId)) {
    errors.push('userId is required and must be a valid ObjectId');
  }
  if (payload.hospitalId && !isObjectId(payload.hospitalId)) {
    errors.push('hospitalId must be a valid ObjectId');
  }
  if (!payload.specialty || typeof payload.specialty !== 'string') {
    errors.push('specialty is required and must be a string');
  }
  if (payload.experience !== undefined && (typeof payload.experience !== 'number' || payload.experience < 0)) {
    errors.push('experience must be a non-negative number');
  }
  if (payload.rating !== undefined && (typeof payload.rating !== 'number' || payload.rating < 0 || payload.rating > 5)) {
    errors.push('rating must be a number between 0 and 5');
  }
  if (payload.about !== undefined && typeof payload.about !== 'string') {
    errors.push('about must be a string');
  }

  validateStringArray(payload.languages, 'languages', errors);
  validateStringArray(payload.certifications, 'certifications', errors);
  validateSchedule(payload.schedule, errors);

  return errors;
};

export const validateDoctorUpdate = (payload) => {
  const errors = [];

  if (payload.userId && !isObjectId(payload.userId)) {
    errors.push('userId must be a valid ObjectId');
  }
  if (payload.hospitalId && !isObjectId(payload.hospitalId)) {
    errors.push('hospitalId must be a valid ObjectId');
  }
  if (payload.specialty !== undefined && typeof payload.specialty !== 'string') {
    errors.push('specialty must be a string');
  }
  if (payload.experience !== undefined && (typeof payload.experience !== 'number' || payload.experience < 0)) {
    errors.push('experience must be a non-negative number');
  }
  if (payload.rating !== undefined && (typeof payload.rating !== 'number' || payload.rating < 0 || payload.rating > 5)) {
    errors.push('rating must be a number between 0 and 5');
  }
  if (payload.about !== undefined && typeof payload.about !== 'string') {
    errors.push('about must be a string');
  }
  if (payload.availability !== undefined && typeof payload.availability !== 'boolean') {
    errors.push('availability must be a boolean');
  }
  if (payload.active !== undefined && typeof payload.active !== 'boolean') {
    errors.push('active must be a boolean');
  }

  validateStringArray(payload.languages, 'languages', errors);
  validateStringArray(payload.certifications, 'certifications', errors);
  validateSchedule(payload.schedule, errors);

  return errors;
};
