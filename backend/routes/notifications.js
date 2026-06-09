import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const notifications = await Notification.find().populate('recipientId senderId');
  res.json(notifications);
});

router.get('/recipient/:recipientId', async (req, res) => {
  const notifications = await Notification.find({ recipientId: req.params.recipientId }).populate('recipientId senderId');
  res.json(notifications);
});

router.get('/:id', async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate('recipientId senderId');
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
});

router.post('/', async (req, res) => {
  const notification = new Notification(req.body);
  await notification.save();
  res.status(201).json(notification);
});

router.patch('/:id', async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
});

router.patch('/:id/read', async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  notification.read = true;
  await notification.save();
  res.json(notification);
});

router.delete('/:id', async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
