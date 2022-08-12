const Patient = require('../models/Patient');
const User = require('../models/User');
const PatientVitals = require('../models/PatientVitals');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTotalPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.json(patients.length);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPatientById = async (req, res, next) => {
  const patientId = req.patientId;
  try {
    const patient = await Patient.findOne(patientId).populate('patient', [
      'firstName',
      'lastName',
      'regNumber',
    ]);
    if (!patient) return res.status(400).json({ msg: 'patient not found' });

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Patient not found' });
    }
    res.status(500).send('Server Error');
  }
};
exports.getPatientsById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(400).json({ msg: 'patient not found' });

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Patient not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.registerPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    maritalStatus,
    email,
    phoneNumber,
    nationality,
    state,
    lga,
    occupation,
    password,
    address,
    regNumber,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phoneNumber ||
    !gender ||
    !dateOfBirth ||
    !maritalStatus ||
    !nationality ||
    !state ||
    !lga ||
    !occupation ||
    !address
  )
    return res
      .status(400)
      .json({ errors: [{ msg: 'Please fill all fields' }] });

  var possible = '0123456789';
  var newRegNumber = 'patient';

  for (i = 0; i < 4; i++) {
    newRegNumber += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  try {
    let patient = await Patient.findOne({ email });

    if (patient) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email address has already been used' }] });
    }

    //Encrypt password
    let encryptedPassword;
    const salt = await bcrypt.genSalt(10);

    encryptedPassword = await bcrypt.hash(password, salt);

    patient = new Patient({
      firstName,
      lastName,
      email,
      gender,
      phoneNumber,
      dateOfBirth,
      maritalStatus,
      nationality,
      state,
      lga,
      occupation,
      address,
      password: encryptedPassword,
      regNumber: newRegNumber,
    });

    await patient.save();

    res.json({
      msg: 'Patient created successfully' + ' ' + newRegNumber + ' ' + lastName,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Sever Error' });
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { regNumber, password } = req.body;

  try {
    let patient = await Patient.findOne({ regNumber });

    if (!patient)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Patient Number does not exist' }] });

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch)
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });

    const token = jwt.sign(
      {
        regNumber: patient.email,
        patientId: patient._id.toString(),
      },
      config.get('jwtSecret')
    );

    res.status(200).json({
      token: token,
      user: {
        firstname: patient.firstname,
        lastname: patient.lastname,
        email: patient.email,
        regNumber: patient.regNumber,
        _id: patient._id,
      },
      msg: 'Login successful',
    });
  } catch (error) {
    console.error(err.message);
    res.status(500).json({ msg: 'Sever Error' });
  }
};

exports.vitals = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { temperature, bloodPressure, weight, height } = req.body;

  if (!temperature || !bloodPressure || !weight || !height)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Please fill all fields' }] });

  const bmi = weight / Math.pow(height, 2);

  const patientId = req.patientId;

  try {
    const patient = await Patient.findById(patientId);

    if (!patient)
      return res.status(404).json({ errors: [{ msg: 'account not found' }] });

    const vitals = new PatientVitals({
      temperature,
      bloodPressure,
      weight,
      height,
      bodyMass: bmi,
      patient: patient._id,
    });

    patient.vitals.push(vitals._id);

    await vitals.save();
    await patient.save();

    res.status(201).json({ msg: 'Vitals Checked', vitals });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Sever Error' });
  }
};

exports.updatePatient = async (req, res, next) => {
  const {
    patientId,
    firstname,
    lastname,
    email,
    phoneNumber,
    // password,
    maritalStatus,
    gender,
    dateOfBirth,
    address,
  } = req.body;

  try {
    let patient = await Patient.findById(patientId);

    if(patient){
      patient.firstname = firstname || patient.firstname,
      patient.lastname = lastname || patient.lastname,
      patient.email = email || patient.email,
      patient.phoneNumber = phoneNumber || patient.phoneNumber,
      patient.maritalStatus = maritalStatus || patient.maritalStatus,
      patient.gender = gender || patient.gender,
      patient.dateOfBirth = dateOfBirth || patient.dateOfBirth,
      patient.maritalStatus = maritalStatus || patient.maritalStatus
      patient.address = address || patient.address
    }

    const updatedPatient =  await patient.save()

    res.status(201).json({
      message: 'patient updated successfully',
      patient: updatedPatient,
    });
  } catch (err) {
    console.error(err.message);
    console.log(err);

    res.status(500).send('Server Error');
  }
};
