// ─── Mock Data for E-Hospital Frontend ───────────────────────────────────────

export const DOCTORS = [
  {
    id: 'd1', name: 'Dr. Sarah Mitchell', specialty: 'Cardiologist',
    hospital: 'City General Hospital', rating: 4.9, reviews: 312,
    experience: 14, fee: 80, available: true, online: true,
    languages: ['English', 'French'], avatar: null, initials: 'SM',
    nextSlot: 'Today, 2:00 PM', patients: 1240, education: 'Harvard Medical School',
    about: 'Specialist in cardiovascular diseases with 14 years of clinical experience.',
    tags: ['Heart Disease', 'Hypertension', 'ECG'],
  },
  {
    id: 'd2', name: 'Dr. James Okafor', specialty: 'General Physician',
    hospital: 'Sunrise Medical Center', rating: 4.7, reviews: 198,
    experience: 9, fee: 50, available: true, online: true,
    languages: ['English', 'Yoruba'], avatar: null, initials: 'JO',
    nextSlot: 'Today, 3:30 PM', patients: 890, education: 'University of Lagos',
    about: 'Experienced general practitioner focused on preventive care and chronic disease management.',
    tags: ['Fever', 'Flu', 'Diabetes', 'Hypertension'],
  },
  {
    id: 'd3', name: 'Dr. Aisha Rahman', specialty: 'Pediatrician',
    hospital: 'Children\'s Health Institute', rating: 4.8, reviews: 276,
    experience: 11, fee: 65, available: false, online: false,
    languages: ['English', 'Arabic', 'Urdu'], avatar: null, initials: 'AR',
    nextSlot: 'Tomorrow, 10:00 AM', patients: 1050, education: 'Cairo University',
    about: 'Dedicated pediatrician with expertise in child development and immunization.',
    tags: ['Child Health', 'Vaccination', 'Growth'],
  },
  {
    id: 'd4', name: 'Dr. Carlos Mendez', specialty: 'Neurologist',
    hospital: 'NeuroHealth Clinic', rating: 4.6, reviews: 145,
    experience: 16, fee: 95, available: true, online: true,
    languages: ['English', 'Spanish'], avatar: null, initials: 'CM',
    nextSlot: 'Today, 5:00 PM', patients: 720, education: 'Universidad de Madrid',
    about: 'Expert in neurological disorders including migraines, epilepsy, and stroke management.',
    tags: ['Headache', 'Migraine', 'Epilepsy', 'Stroke'],
  },
  {
    id: 'd5', name: 'Dr. Priya Sharma', specialty: 'Dermatologist',
    hospital: 'SkinCare Specialists', rating: 4.9, reviews: 389,
    experience: 8, fee: 70, available: true, online: true,
    languages: ['English', 'Hindi'], avatar: null, initials: 'PS',
    nextSlot: 'Today, 4:00 PM', patients: 1560, education: 'AIIMS New Delhi',
    about: 'Renowned dermatologist specializing in skin conditions, cosmetic procedures, and hair disorders.',
    tags: ['Acne', 'Eczema', 'Psoriasis', 'Hair Loss'],
  },
  {
    id: 'd6', name: 'Dr. Michael Chen', specialty: 'Orthopedic Surgeon',
    hospital: 'BoneJoint Medical Center', rating: 4.7, reviews: 221,
    experience: 18, fee: 110, available: false, online: false,
    languages: ['English', 'Mandarin'], avatar: null, initials: 'MC',
    nextSlot: 'Tomorrow, 9:00 AM', patients: 980, education: 'Johns Hopkins University',
    about: 'Orthopedic surgeon specializing in joint replacement, sports injuries, and spine disorders.',
    tags: ['Joint Pain', 'Fractures', 'Sports Injury', 'Spine'],
  },
];

export const HOSPITALS = [
  {
    id: 'h1', name: 'City General Hospital', city: 'New York', rating: 4.8,
    beds: 450, doctors: 120, departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'],
    phone: '+1 (212) 555-0100', email: 'info@citygeneralhospital.com',
    address: '123 Medical Ave, New York, NY 10001',
    type: 'General', emergency: true, waitTime: '15 min',
    image: null, initials: 'CG',
    about: 'A leading multi-specialty hospital serving the New York metropolitan area since 1965.',
  },
  {
    id: 'h2', name: 'Sunrise Medical Center', city: 'Los Angeles', rating: 4.6,
    beds: 280, doctors: 85, departments: ['General Medicine', 'Cardiology', 'Gynecology', 'ENT'],
    phone: '+1 (310) 555-0200', email: 'contact@sunrisemedical.com',
    address: '456 Wellness Blvd, Los Angeles, CA 90001',
    type: 'Multi-Specialty', emergency: true, waitTime: '20 min',
    image: null, initials: 'SM',
    about: 'Providing compassionate, high-quality healthcare to the Los Angeles community.',
  },
  {
    id: 'h3', name: 'Children\'s Health Institute', city: 'Chicago', rating: 4.9,
    beds: 200, doctors: 60, departments: ['Pediatrics', 'Neonatology', 'Pediatric Surgery', 'Child Psychiatry'],
    phone: '+1 (312) 555-0300', email: 'hello@childrenshealth.org',
    address: '789 Kids Way, Chicago, IL 60601',
    type: 'Specialty', emergency: true, waitTime: '10 min',
    image: null, initials: 'CH',
    about: 'Dedicated exclusively to the health and well-being of children from birth through adolescence.',
  },
  {
    id: 'h4', name: 'NeuroHealth Clinic', city: 'Boston', rating: 4.7,
    beds: 150, doctors: 40, departments: ['Neurology', 'Neurosurgery', 'Psychiatry', 'Rehabilitation'],
    phone: '+1 (617) 555-0400', email: 'info@neurohealthclinic.com',
    address: '321 Brain St, Boston, MA 02101',
    type: 'Specialty', emergency: false, waitTime: '25 min',
    image: null, initials: 'NH',
    about: 'A premier neurological center offering cutting-edge diagnosis and treatment.',
  },
];

export const APPOINTMENTS = [
  {
    id: 'a1', patientName: 'Eric Johnson', doctorName: 'Dr. Sarah Mitchell',
    doctorSpecialty: 'Cardiologist', date: '2026-05-28', time: '2:00 PM',
    status: 'confirmed', type: 'online', fee: 80, reason: 'Chest pain follow-up',
    hospital: 'City General Hospital',
  },
  {
    id: 'a2', patientName: 'Eric Johnson', doctorName: 'Dr. James Okafor',
    doctorSpecialty: 'General Physician', date: '2026-05-20', time: '10:30 AM',
    status: 'completed', type: 'online', fee: 50, reason: 'Fever and body aches',
    hospital: 'Sunrise Medical Center',
  },
  {
    id: 'a3', patientName: 'Eric Johnson', doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Dermatologist', date: '2026-06-02', time: '4:00 PM',
    status: 'pending', type: 'physical', fee: 70, reason: 'Skin rash consultation',
    hospital: 'SkinCare Specialists',
  },
  {
    id: 'a4', patientName: 'Eric Johnson', doctorName: 'Dr. Carlos Mendez',
    doctorSpecialty: 'Neurologist', date: '2026-05-15', time: '3:00 PM',
    status: 'cancelled', type: 'online', fee: 95, reason: 'Recurring migraines',
    hospital: 'NeuroHealth Clinic',
  },
];

export const PRESCRIPTIONS = [
  {
    id: 'rx1', doctorName: 'Dr. James Okafor', date: '2026-05-20',
    diagnosis: 'Viral Fever with Body Aches',
    medicines: [
      { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '3× daily', duration: '5 days', instructions: 'After meals' },
      { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: '2× daily', duration: '3 days', instructions: 'With food' },
      { name: 'Vitamin C 1000mg', dosage: '1 tablet', frequency: '1× daily', duration: '7 days', instructions: 'Morning' },
    ],
    notes: 'Rest well, drink plenty of fluids. Return if fever persists beyond 5 days.',
    status: 'active',
  },
  {
    id: 'rx2', doctorName: 'Dr. Sarah Mitchell', date: '2026-04-10',
    diagnosis: 'Mild Hypertension',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: '1× daily', duration: '30 days', instructions: 'Morning, with water' },
      { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: '1× daily', duration: '30 days', instructions: 'After breakfast' },
    ],
    notes: 'Monitor blood pressure daily. Reduce salt intake. Follow up in 4 weeks.',
    status: 'completed',
  },
];

export const MESSAGES = [
  { id: 'm1', sender: 'doctor', name: 'Dr. James Okafor', text: 'Hello Eric, how are you feeling today?', time: '10:02 AM', read: true },
  { id: 'm2', sender: 'patient', name: 'Eric Johnson', text: 'Hi Doctor, I still have a slight fever and headache.', time: '10:04 AM', read: true },
  { id: 'm3', sender: 'doctor', name: 'Dr. James Okafor', text: 'I see. Have you been taking the Paracetamol as prescribed?', time: '10:05 AM', read: true },
  { id: 'm4', sender: 'patient', name: 'Eric Johnson', text: 'Yes, 3 times a day after meals. But the headache is still there.', time: '10:07 AM', read: true },
  { id: 'm5', sender: 'doctor', name: 'Dr. James Okafor', text: 'That\'s normal for the first 2 days. Keep hydrated and rest. If it worsens, let me know immediately.', time: '10:08 AM', read: true },
  { id: 'm6', sender: 'patient', name: 'Eric Johnson', text: 'Thank you, Doctor. I will.', time: '10:10 AM', read: false },
];

export const NOTIFICATIONS = [
  { id: 'n1', type: 'appointment', title: 'Appointment Confirmed', message: 'Your appointment with Dr. Sarah Mitchell is confirmed for May 28 at 2:00 PM.', time: '2 hours ago', read: false },
  { id: 'n2', type: 'prescription', title: 'New Prescription', message: 'Dr. James Okafor has issued a new prescription for you.', time: '1 day ago', read: false },
  { id: 'n3', type: 'reminder', title: 'Medication Reminder', message: 'Time to take Paracetamol 500mg — 3rd dose today.', time: '3 hours ago', read: true },
  { id: 'n4', type: 'message', title: 'New Message', message: 'Dr. James Okafor sent you a message.', time: '5 hours ago', read: true },
  { id: 'n5', type: 'followup', title: 'Follow-up Scheduled', message: 'Your follow-up appointment has been scheduled for June 5.', time: '2 days ago', read: true },
];

export const DEPARTMENTS = [
  { id: 'dep1', name: 'Cardiology', icon: '❤️', description: 'Heart and cardiovascular system', doctors: 18 },
  { id: 'dep2', name: 'Neurology', icon: '🧠', description: 'Brain and nervous system disorders', doctors: 12 },
  { id: 'dep3', name: 'Pediatrics', icon: '👶', description: 'Healthcare for infants and children', doctors: 22 },
  { id: 'dep4', name: 'Orthopedics', icon: '🦴', description: 'Bones, joints, and musculoskeletal system', doctors: 15 },
  { id: 'dep5', name: 'Dermatology', icon: '🩺', description: 'Skin, hair, and nail conditions', doctors: 10 },
  { id: 'dep6', name: 'General Medicine', icon: '💊', description: 'Primary care and general health', doctors: 30 },
  { id: 'dep7', name: 'Gynecology', icon: '🌸', description: 'Women\'s reproductive health', doctors: 14 },
  { id: 'dep8', name: 'ENT', icon: '👂', description: 'Ear, nose, and throat conditions', doctors: 9 },
];

export const SYMPTOM_SUGGESTIONS = {
  'headache': ['Neurology', 'General Medicine'],
  'fever': ['General Medicine', 'Pediatrics'],
  'chest pain': ['Cardiology', 'General Medicine'],
  'skin rash': ['Dermatology'],
  'joint pain': ['Orthopedics'],
  'child': ['Pediatrics'],
  'heart': ['Cardiology'],
  'breathing': ['Cardiology', 'General Medicine'],
  'stomach': ['General Medicine', 'Gastroenterology'],
  'back pain': ['Orthopedics', 'Neurology'],
};

export const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
];

export const ADMIN_STATS = {
  totalPatients: 12480,
  totalDoctors: 248,
  totalNurses: 412,
  totalHospitals: 18,
  appointmentsToday: 342,
  pendingApprovals: 7,
  revenue: 284500,
  consultationsThisMonth: 4820,
};

export const PENDING_APPROVALS = [
  { id: 'pa1', name: 'Dr. Fatima Al-Hassan', role: 'Doctor', specialty: 'Gynecology', hospital: 'City General Hospital', submitted: '2026-05-24', status: 'pending', email: 'fatima@email.com', phone: '+1 (555) 111-2222', experience: 7, license: 'MD-2024-00441' },
  { id: 'pa2', name: 'Nurse Robert Kim', role: 'Nurse', specialty: 'ICU', hospital: 'Sunrise Medical Center', submitted: '2026-05-25', status: 'pending', email: 'robert.kim@email.com', phone: '+1 (555) 333-4444', experience: 5, license: 'RN-2024-00882' },
  { id: 'pa3', name: 'Dr. Luca Ferrari', role: 'Doctor', specialty: 'Cardiology', hospital: 'NeuroHealth Clinic', submitted: '2026-05-23', status: 'pending', email: 'luca.f@email.com', phone: '+1 (555) 555-6666', experience: 12, license: 'MD-2024-00993' },
];

export const PATIENTS = [
  { id: 'p1', name: 'Eric Johnson', email: 'eric.johnson@email.com', phone: '+1 (555) 234-5678', dob: '1990-03-15', gender: 'Male', bloodGroup: 'O+', conditions: 'Mild Hypertension', joined: '2024-01-10', appointments: 4, status: 'active', initials: 'EJ' },
  { id: 'p2', name: 'Maria Garcia', email: 'maria.garcia@email.com', phone: '+1 (555) 876-5432', dob: '1985-07-22', gender: 'Female', bloodGroup: 'A+', conditions: 'Diabetes Type 2', joined: '2024-02-14', appointments: 7, status: 'active', initials: 'MG' },
  { id: 'p3', name: 'James Wilson', email: 'james.w@email.com', phone: '+1 (555) 321-9876', dob: '1978-11-05', gender: 'Male', bloodGroup: 'B-', conditions: 'Asthma', joined: '2024-03-01', appointments: 2, status: 'active', initials: 'JW' },
  { id: 'p4', name: 'Aisha Patel', email: 'aisha.p@email.com', phone: '+1 (555) 654-3210', dob: '1995-04-18', gender: 'Female', bloodGroup: 'AB+', conditions: 'None', joined: '2024-04-20', appointments: 1, status: 'active', initials: 'AP' },
  { id: 'p5', name: 'David Chen', email: 'david.chen@email.com', phone: '+1 (555) 789-0123', dob: '1982-09-30', gender: 'Male', bloodGroup: 'O-', conditions: 'Hypertension, High Cholesterol', joined: '2024-01-28', appointments: 9, status: 'inactive', initials: 'DC' },
  { id: 'p6', name: 'Sophie Martin', email: 'sophie.m@email.com', phone: '+1 (555) 456-7890', dob: '2000-12-12', gender: 'Female', bloodGroup: 'A-', conditions: 'Eczema', joined: '2024-05-05', appointments: 3, status: 'active', initials: 'SM' },
];
