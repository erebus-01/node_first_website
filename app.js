const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport configurations
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

// Connect DB
mongoose.connect(db, {
  useNewUrlParser: true,
})
.then(() => console.log("Mongo DB connected"))
.catch(err => console.log(err));

//ejs
app.use('/assets', express.static('assets'))
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('adminLayout', './admin/layout')
app.use(express.urlencoded({extended: false}));

//express-session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash())

//global
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

//routes
app.use("/", require('./routes/index'));
app.use("/users", require('./routes/users'));
app.use("/admin", require('./routes/admin'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server listening on ${PORT}`));