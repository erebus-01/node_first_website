const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Customer = require('../models/Customer');

module.exports = function(passport) {
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
}