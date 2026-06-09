export const validateUserPayload = (payload, requireAll = true) => {
  const errors = [];
  if (requireAll && !payload.name) errors.push('Name is required.');
  if (requireAll && !payload.email) errors.push('Email is required.');
  if (requireAll && !payload.password && !payload.passwordHash) errors.push('Password or password hash is required.');
  if (payload.email && !payload.email.includes('@')) errors.push('Email must be valid.');
  if (payload.status && !['active', 'inactive'].includes(payload.status)) errors.push('Status must be active or inactive.');
  if (payload.permissions && !Array.isArray(payload.permissions)) errors.push('Permissions must be an array.');
  return { valid: errors.length === 0, errors };
};

export const validateRolePayload = (payload, requireAll = true) => {
  const errors = [];
  if (requireAll && !payload.name) errors.push('Role name is required.');
  if (payload.permissions && !Array.isArray(payload.permissions)) errors.push('Permissions must be an array.');
  return { valid: errors.length === 0, errors };
};

export const validatePermissionPayload = (payload) => {
  const errors = [];
  if (!payload.name) errors.push('Permission name is required.');
  return { valid: errors.length === 0, errors };
};

export const validateSettingPayload = (payload) => {
  const errors = [];
  if (payload.value === undefined) errors.push('Value is required.');
  return { valid: errors.length === 0, errors };
};

export const validateAnnouncementPayload = (payload, requireAll = true) => {
  const errors = [];
  if (requireAll && !payload.title) errors.push('Title is required.');
  if (requireAll && !payload.message) errors.push('Message is required.');
  if (payload.status && !['draft', 'published', 'archived'].includes(payload.status)) errors.push('Status must be draft, published or archived.');
  if (payload.broadcast && payload.targetRoles && payload.targetRoles.length) errors.push('Broadcast announcements should not include targetRoles.');
  if (payload.targetUserIds && !Array.isArray(payload.targetUserIds)) errors.push('Target user IDs must be an array.');
  return { valid: errors.length === 0, errors };
};
