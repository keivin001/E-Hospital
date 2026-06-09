import express from 'express';
import * as doctorController from '../controllers/doctorController.js';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin', 'doctor', 'perm:view_doctors'), doctorController.listDoctors);
router.get('/:id/dashboard', verifyToken, authorize('admin', 'doctor', 'perm:view_doctor_dashboard'), doctorController.getDoctorDashboard);
router.get('/:id/patients', verifyToken, authorize('admin', 'doctor', 'perm:view_doctor_patients'), doctorController.getDoctorPatients);
router.get('/:id/appointments', verifyToken, authorize('admin', 'doctor', 'perm:view_doctor_appointments'), doctorController.getDoctorAppointments);
router.get('/:id/prescriptions', verifyToken, authorize('admin', 'doctor', 'perm:view_doctor_prescriptions'), doctorController.getDoctorPrescriptions);
router.get('/:id/full', verifyToken, authorize('admin', 'doctor', 'perm:view_doctor_profile'), doctorController.getDoctorProfile);
router.get('/:id', verifyToken, authorize('admin', 'doctor', 'perm:view_doctor'), doctorController.getDoctorById);
router.post('/', verifyToken, authorize('admin', 'perm:create_doctors'), doctorController.createDoctor);
router.put('/:id', verifyToken, authorize('admin', 'doctor', 'perm:update_doctors'), doctorController.updateDoctor);
router.delete('/:id', verifyToken, authorize('admin', 'perm:delete_doctors'), doctorController.deleteDoctor);

export default router;
