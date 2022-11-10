const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Customer = require('../models/Customer');

module.exports = function(passport) {
  passport.use('admin', new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
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

  passport.use('customer', new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    Customer.findOne({email: email})
      .then(customer => {
        if(!customer) {
          return done(null, false, { message: 'Email is not registered' });
        }
        //Password user
        bcrypt.compare(password, customer.password, (err, match) => {
          if(err) { throw err; }

          if(match) {
            return done(null, customer);
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
      if(err) done(err, user);
      if(user) {
        done(null, user);
      }
      else {
        Customer.findById(id, (err, user) => {
          if(err) done(err)
          done(null, user)
        })
      }
    })
  });
  // passport.deserializeUser((id, done) => {
  //   Customer.findById(id, (err, customer) => {
  //     done(err, customer);
  //   })
  // });
}
