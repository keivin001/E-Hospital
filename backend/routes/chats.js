import express from 'express';
import Chat from '../models/Chat.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const chats = await Chat.find().populate('participants');
  res.json(chats);
});

router.get('/user/:userId', async (req, res) => {
  const chats = await Chat.find({ participants: req.params.userId }).populate('participants');
  res.json(chats);
});

router.get('/:id', async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate('participants');
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  res.json(chat);
});

router.post('/', async (req, res) => {
  const chat = new Chat(req.body);
  await chat.save();
  res.status(201).json(chat);
});

router.post('/:id/message', async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  chat.messages.push(req.body);
  await chat.save();
  res.json(chat);
});

router.put('/:id', async (req, res) => {
  const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!chat) return res.status(404).json({ message: 'Chat not found' });
  res.json(chat);
});

router.delete('/:id', async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
