const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const Hospital = require('./Hospital');
const Appointment = require('./Appointment');
const Ambulance = require('./Ambulance');

// Import New Models
const Prescription = require('./Prescription');
const MedicalReport = require('./MedicalReport');
const Vitals = require('./Vitals');

// --- Relationships ---

// Doctor & User (One-to-One)
User.hasOne(Doctor, { foreignKey: 'userId', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

// Hospital & Admin (One-to-Many)
Hospital.hasMany(User, { foreignKey: 'hospitalId' });
User.belongsTo(Hospital, { foreignKey: 'hospitalId' });

// Appointments
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

// --- NEW RELATIONSHIPS (Medical History) ---

// Prescriptions
User.hasMany(Prescription, { foreignKey: 'patientId' });
Prescription.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Prescription, { foreignKey: 'doctorId' });
Prescription.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

// Reports
User.hasMany(MedicalReport, { foreignKey: 'patientId' });
MedicalReport.belongsTo(User, { foreignKey: 'patientId' });

// Vitals
User.hasOne(Vitals, { foreignKey: 'userId' });
Vitals.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Doctor,
    Hospital,
    Appointment,
    Ambulance,
    Prescription,
    MedicalReport,
    Vitals
};