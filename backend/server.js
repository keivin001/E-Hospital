import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import doctorRoutes from './routes/doctors.js';
import patientRoutes from './routes/patients.js';
import appointmentRoutes from './routes/appointments.js';
import prescriptionRoutes from './routes/prescriptions.js';
import notificationRoutes from './routes/notifications.js';
import chatRoutes from './routes/chats.js';
import hospitalRoutes from './routes/hospitals.js';
import adminRoutes from './routes/admin.js';
import medicalRecordRoutes from './routes/medicalRecords.js';
import { requestLogger } from './middleware/logger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('E-Hospital backend is running');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
