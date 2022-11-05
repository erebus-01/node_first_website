const { Router } = require('express');
const express = require('express');
const { route } = require('.');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/User');

router.get('/login', (req, res) => {
  res.render("login", {title: 'Login Page'})
})

router.get('/register', (req, res) => {
  res.render("register", {title: 'Register Page'})
})

router.get('/options-signup', (req, res) => {
  res.render("options-signup", {title: 'Options Sign Up Page'})
})

//handle
router.post('/register', (req, res) => {
  console.log(req.body)
  const {fName, lName, dsName, email, password} = req.body;
  let err = [];

  // check null input field
  if(!fName || !lName || !dsName || !email || !password) {
    err.push({msg: "Please fill in all required fields \n"})
  }
  // check length password
  if(password.length < 6 || password.length > 18) {
    err.push({msg: "Password must be at least 6 characters"})
  }

  if(err.length > 0){
    res.render('register', {
      err, 
      fName, 
      lName, 
      dsName, 
      email, 
      password
    });
  }
  else{
    User.findOne({
      dsName: dsName
    }).then(user => {
      if(user){
        err.push({msg: "Display name already registered"})
        res.render('register', {
          err, 
          fName, 
          lName, 
          dsName, 
          email, 
          password
        });
      }
      else{
        const newUser = new User({
          fName,
          lName, 
          dsName, 
          email, 
          password
        });

        bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'Account registration is successful, you can log in to start downloading the game now');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err))
        }))
      }
    })
    User.findOne({
      email: email
    }).then(user => {
      if(user){
        err.push({msg: "Email already registered"})
        res.render('register', {
          err, 
          fName, 
          lName, 
          dsName, 
          email, 
          password
        });
      }
      else{
        const newUser = new User({
          fName,
          lName, 
          dsName, 
          email, 
          password
        });

        bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'Account registration is successful, you can log in to start downloading the game now');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err))
        }))
      }
    })
  }
})

//login handle
router.post('/login' , (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/index',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

//logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router
