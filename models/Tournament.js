const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  docType: {
    type: String,
    required: true
  },
  tournamentName: {
    type: String,
    required: true
  },
  tournamentId: {
    type: String,
    required: true
  },
  tournamentOwnerId: {
    type: String,
    required: true
  },
  tournamentPassCode: {
    type: String,
    required: true
  },
  tournamentDescription: {
    type: String,
    required: true
  },
  tournamentType: {
    type: String,
    required: true
  },
  tournamentMaxParticipate: {
    type: Number,
    required: true
  },
  tournamentStartDate: {
    type: Date,
    required: true
  },
  tournamentEndDate: {
    type: Date,
  },
  tournamentStatus: {
    type: String,
    required: true
  },
  tournamentCreateDate: {
    type: Date,
    default: new Date()
  }
});

const Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = Tournament;
