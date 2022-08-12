const express = require('express');
const { check, body } = require('express-validator');

const patientController = require('../controllers/Patient');

const isAuth = require('../middleware/auth');

const router = express.Router();

router.get('/get-all-patients', patientController.getAllPatients);

router.get('/get-total-patients', patientController.getTotalPatients);

router.get('/', isAuth ,patientController.getPatientById)

router.get('/:patientId', patientController.getPatientsById);

router.post('/update', patientController.updatePatient);

// router.post(
//   '/register',
//   [
//     check('firstName', 'Firstname is required').not().isEmpty(),
//     check('lastName', 'Lastname is required').not().isEmpty(),
//     check('email', 'Please include a valid email address').isEmail(),
//     check('phoneNumber', 'Please include a valid phone number').isLength({
//       min: 11,
//     }),
//     check(
//       'password',
//       'Please enter a password with 5 or more characters'
//     ).isLength({ min: 5 }),
//     check('dateOfBirth', 'Date of Birth is required').not().isEmpty(),
//     check('gender', 'Gender is required').not().isEmpty(),
//     check('maritalStatus', 'Marital Status is required').not().isEmpty(),
//     check('nationality', 'Nationality is required').not().isEmpty(),
//     check('state', 'State of Origin is required').not().isEmpty(),
//     check('lga', 'LGA is required').not().isEmpty(),
//     check('occupation', 'Occupation is required').not().isEmpty(),
//     check('address', 'Address is required').not().isEmpty(),
//   ],
//   patientController.registerPatient
// );

// router.post(
//   '/login',
//   [
//     check('regNumber', 'Please include a valid staff number').not().isEmpty(),
//     check(
//       'password',
//       'Please enter a password with 5 or more characters'
//     ).isLength({ min: 5 }),
//   ],
//   patientController.login
// );

router.post(
  '/vitals',
  [
    check('temperature', 'Temperateheture is required').not().isEmpty(),
    check('bloodPressure', 'Blood Pressure is required').not().isEmpty(),
    check('weight', 'Weight is required').not().isEmpty(),
    check('height', 'Height is required').not().isEmpty(),
  ],
  isAuth,
  patientController.vitals
);

module.exports = router;
