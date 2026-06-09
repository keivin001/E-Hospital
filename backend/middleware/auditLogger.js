import AuditLog from '../models/AuditLog.js';












export const logAuditAction = async (req, { action, resourceType, resourceId, details = {} }) => {
  if (!req.user) return null;
  return AuditLog.create({
    actorId: req.user._id,
    actorRole: req.user.role,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });
}