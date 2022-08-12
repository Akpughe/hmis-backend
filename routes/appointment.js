const express = require('express');
const { check, body } = require('express-validator');

const appointmentController = require('../controllers/Appointment');

const isAuth = require('../middleware/auth');

const router = express.Router();

router.get('/get-by-id/:id', isAuth ,appointmentController.getAppointmentById);
router.get('/get-all-appointments', isAuth ,appointmentController.getAllAppoinments);

router.post(
  '/book-appointment',
  isAuth,
  [
    check('appointmentDate', 'Appointment Date is required').not().isEmpty(),
    check('concern', 'Concern is required').not().isEmpty(),
  ],
  appointmentController.bookAppointment
);

router.post('/check-in', appointmentController.checkIn)

module.exports = router;
