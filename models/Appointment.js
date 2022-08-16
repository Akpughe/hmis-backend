var mongoose = require('mongoose');

var AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    appointmentNumber: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    concern: {
      type: String,
      required: true,
    },
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    status: {
      type: String,
      default: 'Not started',
      enum: [
        'Complete',
        'In Progress',
        'Not started',
        'Canceled',
        'Rescheduled',
        'Missed',
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
