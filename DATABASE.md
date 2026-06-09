# MongoDB Database Guide for E-Hospital

## Overview
This document describes how to set up and use MongoDB as the primary database for the E-Hospital application.

The E-Hospital front-end is built with React and Vite. To persist data, you should add a backend API that connects to MongoDB and exposes CRUD endpoints for the app.

A complete backend implementation has been added in the `backend/` folder, including models, routes, and a MongoDB connection layer.

## Recommended Stack
- MongoDB Atlas or MongoDB Community Server
- Node.js with Express
- Mongoose (optional, but recommended for schema modeling)
- dotenv for environment variables

## Prerequisites
1. Install Node.js (v18+ recommended)
2. Create a MongoDB cluster on MongoDB Atlas or install MongoDB locally
3. Create a database named `ehospital`
4. Obtain a MongoDB connection string

## Environment Variables
Store sensitive values in a `.env` file in your backend project root.

Example `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ehospital?retryWrites=true&w=majority
PORT=4000
```

> Do not commit `.env` to source control.

## Suggested Collections and Schemas

### `users`
Fields:
- `_id`: ObjectId
- `name`: string
- `email`: string
- `passwordHash`: string
- `role`: string (`admin`, `doctor`, `patient`)
- `phone`: string
- `avatarUrl`: string
- `createdAt`: Date

### `doctors`
Fields:
- `_id`: ObjectId
- `userId`: ObjectId (reference to `users`)
- `specialty`: string
- `hospital`: string
- `experience`: number
- `rating`: number
- `about`: string
- `available`: boolean

### `patients`
Fields:
- `_id`: ObjectId
- `userId`: ObjectId (reference to `users`)
- `age`: number
- `gender`: string
- `medicalHistory`: string[]
- `bloodType`: string
- `appointmentIds`: ObjectId[]

### `appointments`
Fields:
- `_id`: ObjectId
- `patientId`: ObjectId
- `doctorId`: ObjectId
- `date`: Date
- `status`: string (`pending`, `confirmed`, `cancelled`, `completed`)
- `reason`: string
- `notes`: string

### `prescriptions`
Fields:
- `_id`: ObjectId
- `appointmentId`: ObjectId
- `doctorId`: ObjectId
- `patientId`: ObjectId
- `items`: [{ `name`: string, `dosage`: string, `frequency`: string }]
- `issueDate`: Date

### `notifications`
Fields:
- `_id`: ObjectId
- `userId`: ObjectId
- `title`: string
- `message`: string
- `read`: boolean
- `createdAt`: Date

### `chats`
Fields:
- `_id`: ObjectId
- `participants`: ObjectId[]
- `messages`: [{ `senderId`: ObjectId, `text`: string, `sentAt`: Date }]

## Example Backend Setup

Install dependencies:

```bash
npm init -y
npm install express mongoose dotenv cors
```

Create `server.js`:

```js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

app.get('/', (req, res) => {
  res.send('E-Hospital API is running');
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`);
});
```

## Example Mongoose Models

Create `models/User.js`:

```js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  phone: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;
```

Create `models/Appointment.js`:

```js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' },
  reason: String,
  notes: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
```

## CRUD Endpoint Examples

Create a route file `routes/appointments.js`:

```js
import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const appointments = await Appointment.find().populate('patientId doctorId');
  res.json(appointments);
});

router.post('/', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.status(201).json(appointment);
});

router.put('/:id', async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(appointment);
});

router.delete('/:id', async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
```

Then import the router into `server.js`:

```js
import appointmentRoutes from './routes/appointments.js';
app.use('/api/appointments', appointmentRoutes);
```

## Connecting the React App
In the React app, use `axios` or fetch to call backend endpoints, for example:

```js
import axios from 'axios';

const response = await axios.get('http://localhost:4000/api/appointments');
```

Use `proxy` in development or set your backend URL in a config file.

## Seed Data Example

A minimal `appointments` document:

```json
{
  "patientId": "64890bdeb234b28875d0e1ae",
  "doctorId": "64890bdeb234b28875d0e1af",
  "date": "2026-07-01T10:00:00.000Z",
  "status": "confirmed",
  "reason": "General checkup"
}
```

## Deployment Notes
- When deploying, use a secure MongoDB connection string
- Set `MONGODB_URI` as an environment variable in your hosting provider
- If deploying backend and frontend separately, configure CORS and API base URLs

## Summary
This guide is designed to help you add a MongoDB-powered backend to E-Hospital. The React frontend will consume API routes while MongoDB stores users, doctors, appointments, prescriptions, notifications, and chat data.
