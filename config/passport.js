const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
      User.findOne({email: email})
        .then(user => {
          if(!user) {
            return done(null, false, { message: 'Email is not registered' });
          }

          //Password user
          bcrypt.compare(password, user.password, (err, match) => {
            if(err) { throw err; }

            if(match) {
              return done(null, user);
            }
            else{
              return done(null, false, { message: 'Password is incorrect' });
            }
          });
        })
        .catch(err => console.log(err));  
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    })
  });
}