# E-Hospital Backend

This backend provides a MongoDB-powered API for the E-Hospital application, including a complete Patient Module with authentication, validation, search, filtering, and pagination.

## Setup
1. Create a `.env` file in the `backend` folder.
2. Add the following keys:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

3. Run:

```bash
cd backend
npm install
npm run dev
```

The backend listens on `http://localhost:4000` by default.

## Patient Module Endpoints
- `POST /api/auth/register` - register a new user and patient profile
- `POST /api/auth/login` - login and receive a JWT token
- `GET /api/patients` - admin/doctor only, list patients with search, filters, pagination
- `GET /api/patients/me` - authenticated patient profile
- `GET /api/patients/user/:userId` - fetch patient by user account
- `GET /api/patients/:id` - fetch a patient record
- `GET /api/patients/:id/full` - full patient profile with appointments, prescriptions, notifications, and chats
- `POST /api/patients` - admin only, create a patient profile for existing user
- `POST /api/patients/create-full` - admin only, create user + patient + related records
- `PUT /api/patients/:id` - update patient profile
- `DELETE /api/patients/:id` - admin only, delete patient profile
- `DELETE /api/patients/:id/clear` - clear all patient-related records

## Doctor Module Endpoints
- `GET /api/doctors` - admin/doctor only, list doctors with search, filters, pagination
- `GET /api/doctors/:id` - get doctor profile
- `GET /api/doctors/:id/full` - full doctor profile with patients, appointments, prescriptions, medical records, and notifications
- `GET /api/doctors/:id/dashboard` - doctor/admin dashboard statistics
- `GET /api/doctors/:id/patients` - get doctor's patient roster
- `GET /api/doctors/:id/appointments` - get doctor appointments
- `GET /api/doctors/:id/prescriptions` - get doctor prescriptions
- `POST /api/doctors` - admin only, create doctor profile
- `PUT /api/doctors/:id` - update doctor profile
- `DELETE /api/doctors/:id` - admin only, delete doctor profile

## Medical Record Module Endpoints
- `GET /api/medical-records` - admin/doctor only, list medical records with filters and pagination
- `GET /api/medical-records/:id` - get a medical record
- `GET /api/medical-records/patient/:patientId` - get records for a patient
- `GET /api/medical-records/doctor/:doctorId` - get records for a doctor
- `POST /api/medical-records` - doctor/admin only, create a medical record
- `PUT /api/medical-records/:id` - doctor/admin only, update a medical record
- `DELETE /api/medical-records/:id` - admin only, delete a medical record

## Admin Module Endpoints
- `GET /api/admin/dashboard` - admin only, system analytics and summary
- `GET /api/admin/reports` - admin only, high-level system reports
- `GET /api/admin/users` - admin only, list users with filters and pagination
- `POST /api/admin/users` - admin only, create a user account with role and permissions
- `PUT /api/admin/users/:id` - admin only, update user metadata
- `PATCH /api/admin/users/:id/status` - admin only, activate/deactivate a user
- `PATCH /api/admin/users/:id/role` - admin only, assign a role to a user
- `PATCH /api/admin/users/:id/permissions` - admin only, update custom permissions for a user
- `DELETE /api/admin/users/:id` - admin only, delete a user
- `GET /api/admin/roles` - admin only, list roles
- `POST /api/admin/roles` - admin only, create a role
- `PUT /api/admin/roles/:id` - admin only, update a role
- `DELETE /api/admin/roles/:id` - admin only, delete a role
- `GET /api/admin/permissions` - admin only, list permissions
- `POST /api/admin/permissions` - admin only, create a permission
- `DELETE /api/admin/permissions/:id` - admin only, delete a permission
- `GET /api/admin/settings` - admin only, list system settings
- `GET /api/admin/settings/:key` - admin only, get one setting
- `PUT /api/admin/settings/:key` - admin only, update a system setting
- `GET /api/admin/audits` - admin only, list audit logs
- `GET /api/admin/audits/:id` - admin only, get a single audit log
- `GET /api/admin/announcements` - admin only, list announcements
- `POST /api/admin/announcements` - admin only, create an announcement
- `PUT /api/admin/announcements/:id` - admin only, update an announcement
- `DELETE /api/admin/announcements/:id` - admin only, delete an announcement
- `POST /api/admin/announcements/:id/send` - admin only, publish announcement notifications

## Search & Pagination
The `GET /api/patients` endpoint supports query parameters:
- `search` - text search on patient and user fields
- `gender` - filter by gender
- `bloodType` - filter by blood type
- `active` - `true` or `false`
- `page` - page number
- `limit` - number of records per page

## Scripts
- `npm run dev` - start the development server
- `npm run seed` - seed the sample database
- `npm run migrate:patients` - build patient indexes and migration structure
- `npm run migrate:admins` - build admin module indexes and migration structure
- `npm run cleanup:patients` - remove orphaned patient-related records
- `npm run cleanup:samples` - remove seeded sample users, hospital, appointments, prescriptions, notifications, and chats
- `npm run purge:all` - purge runtime data collections (preserve users and RBAC system definitions by default)

### Purge options
- `PURGE_KEEP_USERS=false npm run purge:all` - purge all runtime data and delete user accounts
- `PURGE_KEEP_SYSTEM=false npm run purge:all` - preserve users while also removing RBAC/system metadata
- `PURGE_ALL=true npm run purge:all` - force full database wipe including users, roles, permissions, and system settings

## Notes
- The backend uses Express and Mongoose.
- Patient APIs are protected with JWT authentication.
- Validation and error handling are implemented for all patient CRUD operations.
- The `.env` file is ignored by git by default.
