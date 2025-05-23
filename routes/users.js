const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

// GET sign up form
router.get('/register', (req, res) => {
  res.render('users/register', { 
    _csrf: req.csrfToken() 
  });
});

// POST sign up
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/users/register');
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('users/login', { 
    _csrf: req.csrfToken() 
  });
});

// POST login
router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/users/login'
}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/listings');
});

// LOGOUT (GET method)
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/listings');
  });
});
// POST logout (more secure)
router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/listings');
  });
});


module.exports = router;
