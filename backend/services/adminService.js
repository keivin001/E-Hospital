import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import SystemSetting from '../models/SystemSetting.js';
import AuditLog from '../models/AuditLog.js';
import Announcement from '../models/Announcement.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Notification from '../models/Notification.js';

const buildUserQuery = (filters = {}) => {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (filters.status) query.status = filters.status;
  if (filters.email) query.email = { $regex: filters.email, $options: 'i' };
  if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
  return query;
};

const ensureObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listUsers = async ({ filters, page = 1, limit = 25, sort = '-createdAt' }) => {
  const query = buildUserQuery(filters);
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-passwordHash')
    .lean();
  return { total, page, limit, users };
};

export const getUserById = async (id) => {
  if (!ensureObjectId(id)) return null;
  return User.findById(id).select('-passwordHash').lean();
};

export const createUser = async (payload) => {
  const userData = { ...payload };
  if (payload.role) {
    const role = await Role.findOne({ name: payload.role, active: true });
    if (role) {
      userData.permissions = Array.from(new Set([...(role.permissions || []), ...(payload.permissions || [])]));
    }
  }
  if (payload.password) {
    userData.passwordHash = await bcrypt.hash(payload.password, 12);
    delete userData.password;
  }
  const user = await User.create(userData);
  user.passwordHash = undefined;
  return user;
};

export const updateUser = async (id, payload) => {
  if (!ensureObjectId(id)) return null;
  const user = await User.findById(id);
  if (!user) return null;
  if (payload.role) {
    const role = await Role.findOne({ name: payload.role, active: true });
    if (role) {
      user.role = role.name;
      user.permissions = Array.from(new Set([...(role.permissions || []), ...(payload.permissions || user.permissions || [])]));
    } else {
      user.role = payload.role;
    }
  }
  if (payload.password) {
    user.passwordHash = await bcrypt.hash(payload.password, 12);
  }
  if (payload.permissions && !payload.role) {
    user.permissions = payload.permissions;
  }
  ['name', 'email', 'phone', 'avatarUrl', 'status'].forEach((field) => {
    if (payload[field] !== undefined) user[field] = payload[field];
  });
  await user.save();
  user.passwordHash = undefined;
  return user;
};

export const deleteUser = async (id) => {
  if (!ensureObjectId(id)) return null;
  return User.findByIdAndDelete(id);
};

export const changeUserStatus = async (id, status) => {
  if (!ensureObjectId(id)) return null;
  return User.findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');
};

export const assignRoleToUser = async (userId, roleName) => {
  if (!ensureObjectId(userId)) return null;
  const role = await Role.findOne({ name: roleName, active: true });
  if (!role) throw new Error('Role not found');
  return User.findByIdAndUpdate(
    userId,
    { role: role.name, permissions: role.permissions },
    { new: true }
  ).select('-passwordHash');
};

export const updateUserPermissions = async (userId, permissions) => {
  if (!ensureObjectId(userId)) return null;
  return User.findByIdAndUpdate(userId, { permissions }, { new: true }).select('-passwordHash');
};

export const listRoles = async () => Role.find().lean();
export const getRoleById = async (id) => (ensureObjectId(id) ? Role.findById(id).lean() : null);
export const createRole = async (payload) => Role.create(payload);
export const updateRole = async (id, payload) => (ensureObjectId(id) ? Role.findByIdAndUpdate(id, payload, { new: true }) : null);
export const deleteRole = async (id) => (ensureObjectId(id) ? Role.findByIdAndDelete(id) : null);

export const listPermissions = async () => Permission.find().lean();
export const createPermission = async (payload) => Permission.create(payload);
export const deletePermission = async (id) => (ensureObjectId(id) ? Permission.findByIdAndDelete(id) : null);

export const listSystemSettings = async () => SystemSetting.find().lean();
export const getSystemSetting = async (key) => SystemSetting.findOne({ key }).lean();
export const upsertSystemSetting = async (key, value, description, updatedBy) =>
  SystemSetting.findOneAndUpdate(
    { key },
    { value, description, updatedBy, active: true, updatedAt: Date.now() },
    { upsert: true, new: true }
  );

export const listAuditLogs = async ({ filters = {}, page = 1, limit = 25 } = {}) => {
  const query = {};
  if (filters.actorId && ensureObjectId(filters.actorId)) query.actorId = filters.actorId;
  if (filters.action) query.action = { $regex: filters.action, $options: 'i' };
  if (filters.resourceType) query.resourceType = filters.resourceType;
  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { total, page, limit, logs };
};

export const getAuditLog = async (id) => (ensureObjectId(id) ? AuditLog.findById(id).lean() : null);
export const createAuditLog = async (payload) => AuditLog.create(payload);

export const listAnnouncements = async ({ status, page = 1, limit = 25 } = {}) => {
  const query = {};
  if (status) query.status = status;
  const total = await Announcement.countDocuments(query);
  const announcements = await Announcement.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  return { total, page, limit, announcements };
};

export const getAnnouncementById = async (id) => (ensureObjectId(id) ? Announcement.findById(id).lean() : null);
export const createAnnouncement = async (payload) => Announcement.create(payload);
export const updateAnnouncement = async (id, payload) =>
  (ensureObjectId(id) ? Announcement.findByIdAndUpdate(id, payload, { new: true }) : null);
export const deleteAnnouncement = async (id) => (ensureObjectId(id) ? Announcement.findByIdAndDelete(id) : null);

export const sendAnnouncementNotifications = async (announcement) => {
  const recipientQuery = [];
  if (announcement.broadcast) {
    recipientQuery.push({ status: 'active' });
  }
  if (announcement.targetRoles?.length) {
    recipientQuery.push({ role: { $in: announcement.targetRoles } });
  }
  if (announcement.targetUserIds?.length) {
    recipientQuery.push({ _id: { $in: announcement.targetUserIds } });
  }

  let recipients = [];
  if (announcement.broadcast) {
    recipients = await User.find({ status: 'active' }).select('_id').lean();
  } else if (recipientQuery.length) {
    recipients = await User.find({ $or: recipientQuery }).select('_id').lean();
  }

  const uniqueRecipientIds = [...new Set(recipients.map((recipient) => recipient._id.toString()))];
  if (!uniqueRecipientIds.length) return [];
  const notifications = uniqueRecipientIds.map((recipientId) => ({
    recipientId,
    senderId: announcement.senderId,
    type: 'announcement',
    title: announcement.title,
    message: announcement.message,
    relatedType: 'Announcement',
    relatedId: announcement._id,
  }));
  return Notification.insertMany(notifications);
};

export const getDashboardStats = async () => {
  const [usersByRole, totalUsers, activeUsers, inactiveUsers, totalAppointments, totalPrescriptions, totalMedicalRecords, totalAudits, totalNotifications] =
    await Promise.all([
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'inactive' }),
      Appointment.countDocuments(),
      Prescription.countDocuments(),
      MedicalRecord.countDocuments(),
      AuditLog.countDocuments(),
      Notification.countDocuments(),
    ]);

  const roleCounts = usersByRole.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    roleCounts,
    totalAppointments,
    totalPrescriptions,
    totalMedicalRecords,
    totalAudits,
    totalNotifications,
  };
};

export const getSystemReports = async () => {
  const [doctorCount, patientCount, pendingAppointments, pendingPrescriptions, recentAnnouncements] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    Prescription.countDocuments({ status: 'pending' }),
    Announcement.find({ status: 'published' }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return { doctorCount, patientCount, pendingAppointments, pendingPrescriptions, recentAnnouncements };
};
