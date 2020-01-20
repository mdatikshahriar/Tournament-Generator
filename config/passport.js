const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const Account = require('../models/Account');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
      // Match user
      Account.findOne({
        accountUsername: username
      }).then(account => {
        if (!account) {
          return done(null, false, { message: 'The username doesn\'t exist' });
        }

        // Match password
        bcrypt.compare(password, account.accountPassword, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            success = require('../app').myCache.set("ACCOUNT_KEY", account);
            return done(null, account);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(account, done) {
    done(null, account.id);
  });

  passport.deserializeUser(function(id, done) {
    Account.findById(id, function(err, account) {
      done(err, account);
    });
  });
};
