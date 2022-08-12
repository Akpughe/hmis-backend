var mongoose = require('mongoose');

var HealthRSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  diagnosis: {
    type: String,
    required: true,
  },
  prescription: {
    type: String,
    required: true,
  },
},
    {timestamps:true}
);

module.exports = mongoose.model('HealthR', HealthRSchema);
