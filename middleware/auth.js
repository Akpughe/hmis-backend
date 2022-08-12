const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  //Get token from the header
  const token = req.header('x-auth-token');

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.userId = decoded.userId;
    req.patientId = decoded.patientId;
    req.appointmentId = decoded.appointmentId;
    // console.log(decoded.patientId);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
