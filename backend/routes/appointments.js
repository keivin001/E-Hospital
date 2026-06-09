import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const appointments = await Appointment.find().populate('patientId doctorId adminId');
  res.json(appointments);
});

router.get('/doctor/:doctorId', async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.params.doctorId }).populate('patientId doctorId adminId');
  res.json(appointments);
});

router.get('/patient/:patientId', async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.params.patientId }).populate('patientId doctorId adminId');
  res.json(appointments);
});

router.get('/:id', async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('patientId doctorId adminId');
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appointment);
});

router.post('/', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.status(201).json(appointment);
});

router.patch('/:id', async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appointment);
});

router.patch('/:id/status', async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  appointment.status = req.body.status || appointment.status;
  appointment.adminId = req.body.adminId || appointment.adminId;
  await appointment.save();
  res.json(appointment);
});

router.delete('/:id', async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
