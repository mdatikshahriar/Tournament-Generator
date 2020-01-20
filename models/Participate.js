const mongoose = require('mongoose');

const ParticipateSchema = new mongoose.Schema({
  docType: {
    type: String,
    required: true
  },
  participateId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  tournamentId: {
    type: String,
    required: true
  }
});

const Participate = mongoose.model('Participate', ParticipateSchema);

module.exports = Participate;
