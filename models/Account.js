const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  docType: {
    type: String,
    required: true
  },
  accountId: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  accountUsername: {
    type: String,
    required: true
  },
  accountEmail: {
    type: String,
    required: true
  },
  accountPhoneNumber: {
    type: String
  },
  accountPassword: {
    type: String,
    required: true
  },
  accountCreateDate: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
