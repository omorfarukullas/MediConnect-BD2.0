const express = require('express');
const router = express.Router();
const { AppointmentNew, Patient, DoctorNew } = require('../models');
const { Op } = require('sequelize');
const { protect } = require('../middleware/authMiddleware');

// ===== CREATE APPOINTMENT =====
router.post('/', protect, async (req, res) => {
    try {
        // Extract patient_id from authenticated user (prevent impersonation)
        const patient_id = req.user.id;
        const { doctor_id, appointment_date, appointment_time, reason_for_visit } = req.body;

        // Check if patient exists
        const patient = await Patient.findByPk(patient_id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if doctor exists
        const doctor = await DoctorNew.findByPk(doctor_id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check for double booking
        const existingAppointment = await AppointmentNew.findOne({
            where: {
                doctor_id,
                appointment_date,
                appointment_time
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ 
                message: 'This time slot is already booked. Please choose another time.' 
            });
        }

        // Create appointment
        const appointment = await AppointmentNew.create({
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            reason_for_visit,
            status: 'PENDING'
        });

        // Fetch complete appointment with patient and doctor details
        const completeAppointment = await AppointmentNew.findByPk(appointment.id, {
            include: [
                { model: Patient, as: 'patient', attributes: ['id', 'full_name', 'email', 'phone'] },
                { model: DoctorNew, as: 'doctor', attributes: ['id', 'full_name', 'specialization', 'city'] }
            ]
        });

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment: completeAppointment
        });
    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===== GET ALL APPOINTMENTS =====
router.get('/', async (req, res) => {
    try {
        const appointments = await AppointmentNew.findAll({
            include: [
                { model: Patient, as: 'patient', attributes: ['id', 'full_name', 'email', 'phone'] },
                { model: DoctorNew, as: 'doctor', attributes: ['id', 'full_name', 'specialization', 'city'] }
            ],
            order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
        });

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===== GET APPOINTMENTS BY PATIENT =====
router.get('/patient/:patientId', async (req, res) => {
    try {
        const appointments = await AppointmentNew.findAll({
            where: { patient_id: req.params.patientId },
            include: [
                { model: Patient, as: 'patient', attributes: ['id', 'full_name', 'email'] },
                { model: DoctorNew, as: 'doctor', attributes: ['id', 'full_name', 'specialization', 'city'] }
            ],
            order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
        });

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get patient appointments error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===== GET APPOINTMENTS BY DOCTOR =====
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const appointments = await AppointmentNew.findAll({
            where: { doctor_id: req.params.doctorId },
            include: [
                { model: Patient, as: 'patient', attributes: ['id', 'full_name', 'email', 'phone'] },
                { model: DoctorNew, as: 'doctor', attributes: ['id', 'full_name', 'specialization'] }
            ],
            order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
        });

        res.json({
            success: true,
            count: appointments.length,
            appointments
        });
    } catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===== UPDATE APPOINTMENT STATUS =====
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const appointment = await AppointmentNew.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        const updatedAppointment = await AppointmentNew.findByPk(appointment.id, {
            include: [
                { model: Patient, as: 'patient', attributes: ['id', 'full_name', 'email'] },
                { model: DoctorNew, as: 'doctor', attributes: ['id', 'full_name', 'specialization'] }
            ]
        });

        res.json({
            message: 'Appointment status updated successfully',
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error('Update appointment status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ===== DELETE APPOINTMENT =====
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await AppointmentNew.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await appointment.destroy();

        res.json({
            message: 'Appointment deleted successfully'
        });
    } catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
