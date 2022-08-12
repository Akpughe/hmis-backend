const express = require('express');
const { check, body } = require('express-validator');

const userController = require('../controllers/User');

const isAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', isAuth, userController.getUserById);

router.get('/get-all-users', userController.getAllUsers);
router.get('/get-all-docs', isAuth, userController.getAllDocs);
router.get('/:userId', userController.getUsersById);

router.post(
  '/register',
  [
    check('firstname', 'Firstname is required').not().isEmpty(),
    check('lastname', 'Lastname is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check('phoneNumber', 'Please include a valid phone number').isLength({
      min: 11,
    }),
    check(
      'password',
      'Please enter a password with 5 or more characters'
    ).isLength({ min: 5 }),
    check('accountType', 'Account type is required').not().isEmpty(),
  ],
  userController.register
);

router.post('/verify', isAuth, userController.verify)

router.post(
  '/login',
  [
    check('userNumber', 'Please include a valid user number').not().isEmpty(),
    check(
      'password',
      'Please enter a password with 5 or more characters'
    ).isLength({ min: 5 }),
  ],
  userController.login
);

router.post(
  '/vitals',
  isAuth,
  [
    check('temperature', 'Temperature is required').not().isEmpty(),
    check('bloodPressure', 'Blood Pressure is required').not().isEmpty(),
    check('weight', 'Weight is required').not().isEmpty(),
    check('height', 'Height is required').not().isEmpty(),
    check('userId', 'User is required').not().isEmpty(),
  ],
  userController.vitals
);

router.post(
  '/health',
  isAuth,
  [
    check('diagnosis', 'Diagnosis is required').not().isEmpty(),
    check('prescription', 'Prescription is required').not().isEmpty(),
    check('userId', 'User is required').not().isEmpty(),
  ],
  userController.healthr
);

module.exports = router;
