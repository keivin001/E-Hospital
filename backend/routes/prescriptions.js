import express from 'express';
import Prescription from '../models/Prescription.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const prescriptions = await Prescription.find().populate('appointmentId patientId doctorId issuedBy approvedBy');
  res.json(prescriptions);
});

router.get('/doctor/:doctorId', async (req, res) => {
  const prescriptions = await Prescription.find({ doctorId: req.params.doctorId }).populate('appointmentId patientId doctorId issuedBy approvedBy');
  res.json(prescriptions);
});

router.get('/patient/:patientId', async (req, res) => {
  const prescriptions = await Prescription.find({ patientId: req.params.patientId }).populate('appointmentId patientId doctorId issuedBy approvedBy');
  res.json(prescriptions);
});

router.get('/:id', async (req, res) => {
  const prescription = await Prescription.findById(req.params.id).populate('appointmentId patientId doctorId issuedBy approvedBy');
  if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
  res.json(prescription);
});

router.post('/', async (req, res) => {
  const prescription = new Prescription(req.body);
  await prescription.save();
  res.status(201).json(prescription);
});

router.patch('/:id', async (req, res) => {
  const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
  res.json(prescription);
});

router.delete('/:id', async (req, res) => {
  await Prescription.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
