const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/user');
const patientRoutes = require('./routes/patient');
const appointmentRoutes = require('./routes/appointment');


const app = express();

const bodyParser = require('body-parser');

//init middleware

connectDB();

app.use(bodyParser.json());

app.use(express.json({ extended: false }));

// let whitelist = ['http://localhost:3000'];
// let corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// app.use(cors(corsOptions));

app.use(cors());

app.get('/', (req, res, next) => res.send('API Running...'));

app.get('/sam', function (req, res) {
  return res.send('sung');
});

app.use('/api/user', userRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/schedule', appointmentRoutes);

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
