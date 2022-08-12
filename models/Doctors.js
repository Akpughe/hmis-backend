var mongoose = require('mongoose');

var DoctorSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    userNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: ['Single', 'Divorced', 'Married'],
    },
    address: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ['Administrator', 'Doctor', 'Nurse', 'Patient'],
    },
    appointment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    vitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PatientVitals',
      },
    ],
    awaiting :[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Awaiting'
      },
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', DoctorSchema);
