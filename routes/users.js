const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Account = require('../models/Account');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', async (req, res) => {
  const { name, username, email, password, password2 } = req.body;
  const docType = 'account';

  let errors = [];

  if (!name || !username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      username,
      email,
      password,
      password2
    });
  } else {

    //Checking email existance
    const emailExist = await Account.findOne({accountEmail: email});
    if(emailExist) {
      errors.push({ errorMessage: "Email already exist"});
      return res.render('register', {
        errors,
        name,
        username,
        email,
        password,
        confirmedPassword
      });
    }

    //Checking username existance
    const usernameExist = await Account.findOne({accountUsername: username});
    if(usernameExist) {
      errors.push({ errorMessage: "Username already exist"});
      return res.render('register', {
        errors,
        name,
        username,
        email,
        password,
        confirmedPassword
      });
    }

    //Hashing password, generating id and creating account
    bcrypt.genSalt(10, async (err, salt) => {
      if(err) throw err;

      const hashedPassword = await bcrypt.hash(password, salt);
      const id = await bcrypt.hash(username+email, salt);

      const newAccount = new Account({
        docType: docType,
        accountId: id,
        accountName: name,
        accountUsername: username,
        accountEmail: email,
        accountPassword: hashedPassword
      });

      newAccount.save()
      .then(account => {
        req.flash('success_msg', 'You are now registered and can log in');
        req.flash('is_logged_in', 'true');
        res.redirect('/login');
      })
      .catch(err => console.log(err));
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  req.flash('is_logged_in', 'true');
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  req.flash('is_logged_in', 'false');
  res.redirect('/login');
});

module.exports = router;
