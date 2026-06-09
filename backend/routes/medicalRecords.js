import express from 'express';
import * as medicalRecordController from '../controllers/medicalRecordController.js';
import { verifyToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:view_medical_records'), medicalRecordController.listMedicalRecords);
router.get('/patient/:patientId', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:view_medical_records'), medicalRecordController.getRecordsByPatient);
router.get('/doctor/:doctorId', verifyToken, authorize('admin', 'doctor', 'perm:view_medical_records'), medicalRecordController.getRecordsByDoctor);
router.get('/:id', verifyToken, authorize('admin', 'doctor', 'patient', 'perm:view_medical_record'), medicalRecordController.getMedicalRecordById);
router.post('/', verifyToken, authorize('doctor', 'admin', 'perm:create_medical_records'), medicalRecordController.createMedicalRecord);
router.put('/:id', verifyToken, authorize('doctor', 'admin', 'perm:update_medical_records'), medicalRecordController.updateMedicalRecord);
router.delete('/:id', verifyToken, authorize('admin', 'perm:delete_medical_records'), medicalRecordController.deleteMedicalRecord);

export default router;
