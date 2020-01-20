const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  req.flash('is_logged_in', 'false');
  res.render('welcome');
});

// Home Page
router.get('/home', ensureAuthenticated, (req, res) => {
  req.flash('is_logged_in', 'true');
  res.render('home', {
    account: req.user
  })
});

module.exports = router;
