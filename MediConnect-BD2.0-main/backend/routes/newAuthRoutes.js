const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Patient, DoctorNew } = require('../models');
const { validatePatientRegistration, validateDoctorRegistration, validateLogin } = require('../middleware/validationMiddleware');

// ===== PATIENT REGISTRATION =====
router.post('/patient/register', validatePatientRegistration, async (req, res) => {
    try {
        const { full_name, email, password, phone, address } = req.body;

        // Check if patient exists
        const existingPatient = await Patient.findOne({ where: { email } });
        if (existingPatient) {
            return res.status(400).json({ 
                success: false,
                message: 'Email already registered. Please use a different email or login.' 
            });
        }

        // Create patient
        const patient = await Patient.create({
            full_name,
            email,
            password,
            phone,
            address
        });

        // Generate token
        const token = jwt.sign(
            { id: patient.id, email: patient.email, role: 'PATIENT' },
            process.env.JWT_SECRET || 'aVeryStrongAndSecretKey',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully! You can now login.',
            token,
            patient: {
                id: patient.id,
                full_name: patient.full_name,
                email: patient.email,
                phone: patient.phone,
                address: patient.address
            }
        });
    } catch (error) {
        console.error('Patient registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration', 
            error: error.message 
        });
    }
});

// ===== PATIENT LOGIN =====
router.post('/patient/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find patient
        const patient = await Patient.findOne({ where: { email } });
        if (!patient) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isMatch = await patient.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: patient.id, email: patient.email, role: 'PATIENT' },
            process.env.JWT_SECRET || 'aVeryStrongAndSecretKey',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful! Welcome back.',
            token,
            patient: {
                id: patient.id,
                full_name: patient.full_name,
                email: patient.email,
                phone: patient.phone,
                address: patient.address
            }
        });
    } catch (error) {
        console.error('Patient login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login', 
            error: error.message 
        });
    }
});

// ===== DOCTOR REGISTRATION =====
router.post('/doctor/register', validateDoctorRegistration, async (req, res) => {
    try {
        const { full_name, email, password, phone, city, specialization } = req.body;

        // Check if doctor exists
        const existingDoctor = await DoctorNew.findOne({ where: { email } });
        if (existingDoctor) {
            return res.status(400).json({ 
                success: false,
                message: 'Email already registered. Please use a different email or login.' 
            });
        }

        // Create doctor
        const doctor = await DoctorNew.create({
            full_name,
            email,
            password,
            phone,
            city,
            specialization
        });

        // Generate token
        const token = jwt.sign(
            { id: doctor.id, email: doctor.email, role: 'DOCTOR' },
            process.env.JWT_SECRET || 'aVeryStrongAndSecretKey',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Doctor registered successfully! You can now login.',
            token,
            doctor: {
                id: doctor.id,
                full_name: doctor.full_name,
                email: doctor.email,
                phone: doctor.phone,
                city: doctor.city,
                specialization: doctor.specialization
            }
        });
    } catch (error) {
        console.error('Doctor registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration', 
            error: error.message 
        });
    }
});

// ===== DOCTOR LOGIN =====
router.post('/doctor/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find doctor
        const doctor = await DoctorNew.findOne({ where: { email } });
        if (!doctor) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isMatch = await doctor.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: doctor.id, email: doctor.email, role: 'DOCTOR' },
            process.env.JWT_SECRET || 'aVeryStrongAndSecretKey',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful! Welcome back.',
            token,
            doctor: {
                id: doctor.id,
                full_name: doctor.full_name,
                email: doctor.email,
                phone: doctor.phone,
                city: doctor.city,
                specialization: doctor.specialization
            }
        });
    } catch (error) {
        console.error('Doctor login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login', 
            error: error.message 
        });
    }
});

module.exports = router;
