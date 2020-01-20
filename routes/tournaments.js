const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Tournament = require('../models/Tournament');
const { ensureAuthenticated } = require('../config/auth');

//Tournament Page
router.get('/createTournament', ensureAuthenticated, (req, res) => {
    req.flash('is_logged_in', 'true');
    res.render('createTournament');
});
  
router.post('/createTournament', async (req, res) => {
    const { tournamentName, tournamentDescription, tournamentType, tournamentMaxParticipate, tournamentStartDate, tournamentEndDate } = req.body;
    const docType = 'tournament';
    const savedAccount = require('../app').myCache.get('ACCOUNT_KEY');
  
    console.log(savedAccount);
  
    const tournamentOwnerId = savedAccount.accountId;
  
    console.log(req.body);
  
    let errors = [];
  
    if (!tournamentName || !tournamentDescription || !tournamentType || !tournamentMaxParticipate || !tournamentStartDate) {
      errors.push({ msg: 'Please enter all these fields' });
    }
  
    if (errors.length > 0) {
      res.render('createTournament', {
        errors,
        tournamentName,
        tournamentDescription,
        tournamentType,
        tournamentMaxParticipate,
        tournamentStartDate,
        tournamentEndDate
      });
    } else {
  
      //Generating id and creating tournament
      bcrypt.genSalt(10, async (err, salt) => {
        if(err) throw err;
  
        const tournamentId = await bcrypt.hash(tournamentOwnerId+tournamentName+tournamentStartDate, salt);
        const tournamentPassCode = Math.random().toString(36).substr(2, 10);
        const tournamentStatus = 'Pending';
  
        const newTournament = new Tournament({
          docType: docType,
          tournamentName: tournamentName,
          tournamentId: tournamentId,
          tournamentOwnerId: tournamentOwnerId,
          tournamentPassCode: tournamentPassCode,
          tournamentDescription: tournamentDescription,
          tournamentType: tournamentType,
          tournamentMaxParticipate: tournamentMaxParticipate,
          tournamentStartDate: tournamentStartDate,
          tournamentEndDate: tournamentEndDate,
          tournamentStatus: tournamentStatus
        });
  
        console.log(newTournament);
  
        newTournament.save()
        .then(tournament => {
          req.flash('success_msg', 'Tournament successfully created');
          req.flash('is_logged_in', 'true');
          res.redirect('/myTournaments');
        })
        .catch(err => console.log(err));
      });
    }
});
  
router.get('/joinTournament', (req, res) => res.render('join'));
  
router.post('/joinTournament', (req, res) => res.render('join'));
  
router.get('/myTournaments', ensureAuthenticated, (req, res) => {
  
    const savedAccount = require('../app').myCache.get('ACCOUNT_KEY');
  
    Tournament.find({
      tournamentOwnerId: savedAccount.accountId
    }).then(tournaments => {
      if (!tournaments) {
        req.flash('is_logged_in', 'true');
        res.render('myTournaments', {
          account: savedAccount,
          tournaments: null
        })
      }
      else{
        req.flash('is_logged_in', 'true');
        res.render('myTournaments', {
          account: savedAccount,
          tournaments: tournaments
        })
      }
    });
});

router.get('/showMyTournament', ensureAuthenticated, (req, res) => {
  const savedAccount = require('../app').myCache.get('ACCOUNT_KEY');
  const savedTournament = require('../app').myCache.get('TOURNAMENT_KEY');

  req.flash('is_logged_in', 'true');
  res.render('showMyTournament', {
    account: savedAccount,
    tournament: savedTournament
  })
});

router.post('/showMyTournament', ensureAuthenticated, (req, res) => {
  const savedAccount = require('../app').myCache.get('ACCOUNT_KEY');

  console.log(req.body.tournamentId);

  Tournament.findOne({
    tournamentId: req.body.tournamentId 
  }).then(tournament => {
    if (!tournament) {
      req.flash('is_logged_in', 'true');
      res.render('showMyTournament', {
        account: savedAccount,
        tournament: null
      })
    }
    else{
      success = require('../app').myCache.set("TOURNAMENT_KEY", tournament);
      req.flash('is_logged_in', 'true');
      res.redirect('/showMyTournament');
    }
  });
});

router.post('/startMyTournament', ensureAuthenticated, (req, res) => {
  const savedAccount = require('../app').myCache.get('ACCOUNT_KEY');

  console.log(req.body.tournamentId);

  Tournament.findOne({
    tournamentId: req.body.tournamentId 
  }).then(tournament => {
    if (!tournament) {
      req.flash('is_logged_in', 'true');
      res.render('showMyTournament', {
        account: savedAccount,
        tournament: null
      })
    }
    else{
      tournament.tournamentStatus = 'Running';
      Tournament.updateOne({tournamentId: req.body.tournamentId }, { $set: { tournamentStatus: 'Running' }}, (err, res) => {
        if(!err){
          success = require('../app').myCache.set("TOURNAMENT_KEY", tournament);
        }
      });
      req.flash('is_logged_in', 'true');
      res.redirect('/showMyTournament');
    }
  });
});

router.post('/endMyTournament', ensureAuthenticated, (req, res) => {
  const savedAccount = require('../app').myCache.get('ACCOUNT_KEY');
  const currentDate = new Date();

  console.log(req.body.tournamentId);

  Tournament.findOne({
    tournamentId: req.body.tournamentId 
  }).then(tournament => {
    if (!tournament) {
      req.flash('is_logged_in', 'true');
      res.render('showMyTournament', {
        account: savedAccount,
        tournament: null
      })
    }
    else{
      tournament.tournamentStatus = 'Ended';
      Tournament.updateOne({tournamentId: req.body.tournamentId }, { $set: { tournamentStatus: 'Ended' , tournamentEndDate: currentDate}}, (err, res) => {
        if(!err){
          success = require('../app').myCache.set("TOURNAMENT_KEY", tournament);
        }
      });
      req.flash('is_logged_in', 'true');
      res.redirect('/showMyTournament');
    }
  });
});
  
module.exports = router;
  