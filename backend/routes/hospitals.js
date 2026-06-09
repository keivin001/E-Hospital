import express from 'express';
import Hospital from '../models/Hospital.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

router.get('/:id', async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
  res.json(hospital);
});

router.post('/', async (req, res) => {
  const hospital = new Hospital(req.body);
  await hospital.save();
  res.status(201).json(hospital);
});

router.put('/:id', async (req, res) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
  res.json(hospital);
});

router.delete('/:id', async (req, res) => {
  await Hospital.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
