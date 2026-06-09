import * as adminService from '../services/adminService.js';
import * as adminValidator from '../validators/adminValidator.js';
import { logAuditAction } from '../middleware/auditLogger.js';

const extractPagination = (query) => ({
  page: parseInt(query.page, 10) || 1,
  limit: parseInt(query.limit, 10) || 25,
});

const handleError = (next, message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  next(error);
};

export const dashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await adminService.getSystemReports();
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { page, limit } = extractPagination(req.query);
    const result = await adminService.listUsers({ filters: req.query, page, limit, sort: req.query.sort || '-createdAt' });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    if (!user) return handleError(next, 'User not found', 404);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateUserPayload(req.body, true);
    if (!valid) return res.status(400).json({ errors });
    const user = await adminService.createUser(req.body);
    await logAuditAction(req, { action: 'create_user', resourceType: 'User', resourceId: user._id, details: { email: user.email } });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateUserPayload(req.body, false);
    if (!valid) return res.status(400).json({ errors });
    const user = await adminService.updateUser(req.params.id, req.body);
    if (!user) return handleError(next, 'User not found', 404);
    await logAuditAction(req, { action: 'update_user', resourceType: 'User', resourceId: user._id, details: req.body });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changeUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) return handleError(next, 'Invalid status', 400);
    const user = await adminService.changeUserStatus(req.params.id, status);
    if (!user) return handleError(next, 'User not found', 404);
    await logAuditAction(req, { action: 'change_user_status', resourceType: 'User', resourceId: user._id, details: { status } });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const assignRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) return handleError(next, 'Role is required', 400);
    const user = await adminService.assignRoleToUser(req.params.id, role);
    if (!user) return handleError(next, 'User or role not found', 404);
    await logAuditAction(req, { action: 'assign_role', resourceType: 'User', resourceId: user._id, details: { role } });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserPermissions = async (req, res, next) => {
  try {
    const { permissions } = req.body;
    if (!Array.isArray(permissions)) return handleError(next, 'Permissions must be an array', 400);
    const user = await adminService.updateUserPermissions(req.params.id, permissions);
    if (!user) return handleError(next, 'User not found', 404);
    await logAuditAction(req, { action: 'update_permissions', resourceType: 'User', resourceId: user._id, details: { permissions } });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await adminService.deleteUser(req.params.id);
    if (!user) return handleError(next, 'User not found', 404);
    await logAuditAction(req, { action: 'delete_user', resourceType: 'User', resourceId: user._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listRoles = async (req, res, next) => {
  try {
    const roles = await adminService.listRoles();
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const getRole = async (req, res, next) => {
  try {
    const role = await adminService.getRoleById(req.params.id);
    if (!role) return handleError(next, 'Role not found', 404);
    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateRolePayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    const role = await adminService.createRole(req.body);
    await logAuditAction(req, { action: 'create_role', resourceType: 'Role', resourceId: role._id, details: req.body });
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateRolePayload(req.body, false);
    if (!valid) return res.status(400).json({ errors });
    const role = await adminService.updateRole(req.params.id, req.body);
    if (!role) return handleError(next, 'Role not found', 404);
    await logAuditAction(req, { action: 'update_role', resourceType: 'Role', resourceId: role._id, details: req.body });
    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const role = await adminService.deleteRole(req.params.id);
    if (!role) return handleError(next, 'Role not found', 404);
    await logAuditAction(req, { action: 'delete_role', resourceType: 'Role', resourceId: role._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listPermissions = async (req, res, next) => {
  try {
    const permissions = await adminService.listPermissions();
    res.json(permissions);
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validatePermissionPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    const permission = await adminService.createPermission(req.body);
    await logAuditAction(req, { action: 'create_permission', resourceType: 'Permission', resourceId: permission._id, details: req.body });
    res.status(201).json(permission);
  } catch (error) {
    next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  try {
    const permission = await adminService.deletePermission(req.params.id);
    if (!permission) return handleError(next, 'Permission not found', 404);
    await logAuditAction(req, { action: 'delete_permission', resourceType: 'Permission', resourceId: permission._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const listSettings = async (req, res, next) => {
  try {
    const settings = await adminService.listSystemSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const getSetting = async (req, res, next) => {
  try {
    const setting = await adminService.getSystemSetting(req.params.key);
    if (!setting) return handleError(next, 'System setting not found', 404);
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateSettingPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    const setting = await adminService.upsertSystemSetting(req.params.key, req.body.value, req.body.description, req.user._id);
    await logAuditAction(req, { action: 'update_setting', resourceType: 'SystemSetting', resourceId: setting._id, details: req.body });
    res.json(setting);
  } catch (error) {
    next(error);
  }
};

export const listAuditLogs = async (req, res, next) => {
  try {
    const { page, limit } = extractPagination(req.query);
    const result = await adminService.listAuditLogs({ filters: req.query, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getAuditLog = async (req, res, next) => {
  try {
    const audit = await adminService.getAuditLog(req.params.id);
    if (!audit) return handleError(next, 'Audit log not found', 404);
    res.json(audit);
  } catch (error) {
    next(error);
  }
};

export const listAnnouncements = async (req, res, next) => {
  try {
    const { page, limit } = extractPagination(req.query);
    const result = await adminService.listAnnouncements({ status: req.query.status, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateAnnouncementPayload(req.body);
    if (!valid) return res.status(400).json({ errors });
    const payload = { ...req.body, senderId: req.user._id };
    const announcement = await adminService.createAnnouncement(payload);
    await logAuditAction(req, { action: 'create_announcement', resourceType: 'Announcement', resourceId: announcement._id, details: payload });
    if (announcement.status === 'published') {
      await adminService.sendAnnouncementNotifications(announcement);
    }
    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const { valid, errors } = adminValidator.validateAnnouncementPayload(req.body, false);
    if (!valid) return res.status(400).json({ errors });
    const announcement = await adminService.updateAnnouncement(req.params.id, req.body);
    if (!announcement) return handleError(next, 'Announcement not found', 404);
    await logAuditAction(req, { action: 'update_announcement', resourceType: 'Announcement', resourceId: announcement._id, details: req.body });
    res.json(announcement);
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await adminService.deleteAnnouncement(req.params.id);
    if (!announcement) return handleError(next, 'Announcement not found', 404);
    await logAuditAction(req, { action: 'delete_announcement', resourceType: 'Announcement', resourceId: announcement._id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendAnnouncement = async (req, res, next) => {
  try {
    const announcement = await adminService.getAnnouncementById(req.params.id);
    if (!announcement) return handleError(next, 'Announcement not found', 404);
    const notifications = await adminService.sendAnnouncementNotifications(announcement);
    await logAuditAction(req, { action: 'send_announcement', resourceType: 'Announcement', resourceId: announcement._id, details: { sentTo: notifications.length } });
    res.json({ announcement, notificationsSent: notifications.length });
  } catch (error) {
    next(error);
  }
};
