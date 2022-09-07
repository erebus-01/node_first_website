const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
  res.render("Welcome", {title: 'Welcome'});
})

router.get('/dashboard', ensureAuthenticated, (req, res) => 
  res.render("dashboard", {
    dsName: req.user.dsName
  })
);

module.exports = router
