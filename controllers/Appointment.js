const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Await = require('../models/Awaiting');
const { validationResult } = require('express-validator');

exports.getAllAppoinments = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const adminId = req.userId;

  try {
    let admin = await User.findById(adminId);
    if (!admin)
      return res.status(404).json({ errors: [{ msg: 'User does not exist' }] });

    if (admin.accountType !== 'Administrator') {
      if (admin.accountType !== 'Doctor') {
        return res.status(404).json({
          errors: [
            { msg: 'You do not have permission to perform this action' },
          ],
        });
      }
    }

    const appointments = await Appointment.find().populate('user', [
      'lastname',
      'firstname',
      'phoneNumber',

    ]);

    res.status(200).json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Sever Error' });
  }
};

exports.getAppointmentById = async (req, res, next) => {
  const appointmentId = req.appointmentId;
  try {
    const appointment = await Appointment.findOne(appointmentId);
    res.json([appointment]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.bookAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { appointmentDate, concern, appointmentTime } = req.body;

  if (!appointmentDate || !concern || !appointmentTime)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Please fill all fields' }] });

  var possible = '0123456789';
  var newAppointmentNumber = 'appointment';

  for (i = 0; i < 4; i++) {
    newAppointmentNumber += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  const userId = req.userId;
  const patientId = req.patientId;
  try {
    const user = await User.findById(userId);
    const patient = await Patient.findById(patientId);
    if (!user)
      return res.status(404).json({ errors: [{ msg: 'account not found' }] });

    const appointment = new Appointment({
      appointmentDate,
      appointmentTime,
      concern,
      appointmentNumber: newAppointmentNumber,
      patient,
      user: user._id,
    });

    // patient.appointment.push(appointment._id);
    user.appointment.push(appointment._id);
    // patient.appointmentP.push(appointment._id);

    // patient.appointment.push(appointment._id);

    await appointment.save();
    await user.save();
    // await patient.save();

    res
      .status(201)
      .json({ msg: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Sever Error' });
  }
};

exports.checkIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.userId;
  const appointmentId = req.appointmentId;

  try {
    const user = await User.findById(userId);
    const awaitting = await Await.find();
    const appointment = await Appointment.findById(appointmentId);
    // if(!appointment){
    //   return res.status(404).json({errors: [{msg:'appointment not found'}]})
    // }

    const toAwait = new Await({
      // user: user._id,
      appointment: appointment._id,
    });

    user.toAwait.push(toAwait._id);

    await toAwait.save();

    res.status(201).json(toAwait);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Sever Error' });
  }
};
