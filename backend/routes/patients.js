import express from 'express';
import * as patientController from '../controllers/patientController.js';
import { verifyToken, authorize, authorizeSelfOr } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin', 'doctor', 'perm:view_patients'), patientController.listPatients);
router.get('/me', verifyToken, authorize('patient', 'perm:view_self_patient'), patientController.getMyProfile);
router.get('/user/:userId', verifyToken, authorizeSelfOr('userId', 'admin', 'doctor', 'perm:view_patient'), patientController.getPatientByUserId);
router.get('/:id', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:view_patient'), patientController.getPatientById);
router.get('/:id/full', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:view_patient_full'), patientController.getPatientProfile);
router.post('/', verifyToken, authorize('admin', 'perm:create_patients'), patientController.createPatient);
router.post('/create-full', verifyToken, authorize('admin', 'perm:create_patients'), patientController.createPatientFull);
router.put('/:id', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:update_patient'), patientController.updatePatient);
router.delete('/:id', verifyToken, authorize('admin', 'perm:delete_patients'), patientController.deletePatient);
router.delete('/:id/clear', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:clear_patient_data'), patientController.clearPatientData);

export default router;
