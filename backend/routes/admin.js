import express from 'express';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();
router.use(verifyToken, authorize('admin'));

router.get('/dashboard', adminController.dashboardStats);
router.get('/reports', adminController.getReports);

// User management
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUser);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id/status', adminController.changeUserStatus);
router.patch('/users/:id/role', adminController.assignRole);
router.patch('/users/:id/permissions', adminController.updateUserPermissions);
router.delete('/users/:id', adminController.deleteUser);

// Roles & permissions
router.get('/roles', adminController.listRoles);
router.get('/roles/:id', adminController.getRole);
router.post('/roles', adminController.createRole);
router.put('/roles/:id', adminController.updateRole);
router.delete('/roles/:id', adminController.deleteRole);

router.get('/permissions', adminController.listPermissions);
router.post('/permissions', adminController.createPermission);
router.delete('/permissions/:id', adminController.deletePermission);

// System settings
router.get('/settings', adminController.listSettings);
router.get('/settings/:key', adminController.getSetting);
router.put('/settings/:key', adminController.updateSetting);

// Audit logs
router.get('/audits', adminController.listAuditLogs);
router.get('/audits/:id', adminController.getAuditLog);

// Announcements
router.get('/announcements', adminController.listAnnouncements);
router.post('/announcements', adminController.createAnnouncement);
router.put('/announcements/:id', adminController.updateAnnouncement);
router.delete('/announcements/:id', adminController.deleteAnnouncement);
router.post('/announcements/:id/send', adminController.sendAnnouncement);

export default router;
