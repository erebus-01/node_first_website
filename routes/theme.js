const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const passport = require('passport')

const Blog = require('../models/Blog')
const Categories = require('../models/Categories')
const Course = require("../models/Course")
const Customer = require('../models/Customer')

router.get('/', async (req, res, next) => {
  try {
    const courseSlide = await Course.find({collections: 'Challenger'})
    console.log(courseSlide)
    res.render("./theme/HTML/HomePage", {layout: 'theme/layout', courseSlide: courseSlide})
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/learn', async (req, res, next) => {
  try {
    const courseSlide = await Course.find({collections: 'Challenger'})
    const performance = await Course.find({collections: 'Performance'})
    const build = await Course.find({collections: 'Build excellent websites'})
    const framework = await Course.find({collections: 'Frameworks'})
    const lighthouse = await Course.find({collections: 'Lighthouse'})
    const explorations = await Course.find({collections: 'Explorations'})

    const context = {
      layout: 'theme/layout', 
      courseSlide: courseSlide, 
      performance: performance, 
      build: build, 
      framework: framework, 
      lighthouse: lighthouse, 
      explorations: explorations, 
    }

    console.log(courseSlide)
    res.render("./theme/HTML/Learn", context)
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/tag/case-study/:page', async (req, res, next) => {
  const currentPage = req.params.page || 1
  const nextPage = 12
  try {
    const blogs = await Blog.find({collections: {$all: ['Case Study']}}).sort({"_id": -1}).skip((currentPage - 1) * nextPage).limit(nextPage).exec()
    console.log(blogs)
    const count = await Blog.find({collections: {$all: ['Case Study']}}).count()

    let totalPages = Math.ceil(count / nextPage)
    const pagePlusOne = parseInt(currentPage) + 1
    const pageMinusOne = parseInt(currentPage) - 1
    
    let context = {
      layout: 'theme/layout', 
      blogs: blogs, 
      currentPage: currentPage,
      totalPages: totalPages,
      pagePlusOne: pagePlusOne,
      pageMinusOne: pageMinusOne,
    }
    res.render("./theme/HTML/CaseStudy", context)
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/about', (req, res) => {
  res.render("./theme/HTML/About", {layout: 'theme/layout'})
})
router.get('/learn/:id', async (req, res, next) => {
  let id = req.params.id;
  try{
    Course.findById(id, (error, course) => {
      if(error) {
        res.redirect('/learn')
      }
      else{
        if(course == null) {
          res.redirect('/learn')
        }
        else{
          res.render('./theme/HTML/DetailCourse', { course: course })
        }
      }
    })
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
})
router.get('/blog/css', (req, res) => {
  res.render("./theme/HTML/DetailCourse")
})
router.get('/tags/:page/', async (req, res, next) => {
  const currentPage = req.params.page || 1
  const nextPage = 18
  try {
    const tags = await Categories.find().sort({"_id": 1}).skip((currentPage - 1) * nextPage).limit(nextPage).exec()
    const count = await Categories.find({}).count()

    let totalPages = Math.ceil(count / nextPage)
    const pagePlusOne = parseInt(currentPage) + 1
    const pageMinusOne = parseInt(currentPage) - 1
    
    let context = {
      layout: 'theme/layout', 
      tags: tags, 
      currentPage: currentPage,
      totalPages: totalPages,
      pagePlusOne: pagePlusOne,
      pageMinusOne: pageMinusOne,
    }

    res.render("./theme/HTML/Tag", context)
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/blogs/:page/', async (req, res, next) => {
  const currentPage = req.params.page || 1
  const nextPage = 12
  try {
    const blogs = await Blog.find().sort({"_id": -1}).skip((currentPage - 1) * nextPage).limit(nextPage).exec()
    const count = await Blog.find({}).count()

    let totalPages = Math.ceil(count / nextPage)
    const pagePlusOne = parseInt(currentPage) + 1
    const pageMinusOne = parseInt(currentPage) - 1
    
    let context = {
      layout: 'theme/layout', 
      blogs: blogs, 
      currentPage: currentPage,
      totalPages: totalPages,
      pagePlusOne: pagePlusOne,
      pageMinusOne: pageMinusOne,
    }
    res.render("./theme/HTML/Blog", context)
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/tags/:tag/:page', async (req, res, next) => {
  const currentPage = req.params.page || 1
  const nextPage = 12
  const nameTag = req.params.tag
  let str2 = nameTag.toUpperCase().replace('-', ' ')
  try {
    let filterName = ''
    const tags = await Categories.find({})
    tags.forEach(blog => {
      if(blog.tags.toUpperCase() === str2) {
        filterName = blog.tags
      }
    })
    const tagsFilter = await Categories.find({tags: filterName})
    const blogs = await Blog.find({collections: {$all: filterName}}).sort({"_id": -1}).skip((currentPage - 1) * nextPage).limit(nextPage).exec()
    // console.log(tags)
    const count = await Blog.find({collections: {$all: filterName}}).count()

    let totalPages = Math.ceil(count / nextPage)
    const pagePlusOne = parseInt(currentPage) + 1
    const pageMinusOne = parseInt(currentPage) - 1
    
    let context = {
      layout: 'theme/layout', 
      blogs: blogs,
      tagsFilter: tagsFilter,
      filterName: filterName,
      currentPage: currentPage,
      totalPages: totalPages,
      pagePlusOne: pagePlusOne,
      pageMinusOne: pageMinusOne,
    }
    res.render("./theme/HTML/MoreTags", context)
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/blog/:id', async (req, res, next) => {
  let id = req.params.id;
  try{
    Blog.findById(id, (error, blog) => {
      if(error) {
        res.redirect('/learn')
      }
      else{
        if(blog == null) {
          res.redirect('/learn')
        }
        else{
          res.render('./theme/HTML/DetailBlog', {layout: 'theme/layout', blog: blog })
        }
      }
    })
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
})


router.get('/measure', (req, res) => {
  res.render("./theme/HTML/Measure", {layout: 'theme/layout'})
})

router.get('/login', (req, res) => {
  res.render("./theme/HTML/Login", {layout: 'theme/layout'})
})
router.post('/login' , (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
})

//logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render("./theme/HTML/Register", {layout: 'theme/layout'})
})
router.post('/register', (req, res) => {
  const {fName, lName, email, password, cfPassword} = req.body;
  let err = [];

  if(password.length < 6 || password.length > 18) {
    err.push({msg: "Password must be at least 6 characters"})
  }
  if(password != cfPassword){
    err.push({msg: "Password not match"})
  }
  if(!req.body.accept && !req.body.add) {
    err.push({msg: "You need accepted all Terms and Condition"})
  }
  if(!req.body.add) {
    err.push({msg: "You need accepted all Terms and Condition"})
  }
  if(!req.body.accept) {
    err.push({msg: "You need accepted all Terms and Condition"})
  }

  if(err.length > 0) {
    console.log(err)
    res.redirect('/register')
  }
  else {
    Customer.findOne({
      email: req.body.email
    }).then(customer => {
      if(customer) {
        err.push({msg: "Email already registered"})
        res.redirect('/register')
      }
      else {
        const newCustomer = new Customer({
          fName: req.body.fName,
          lName: req.body.lName,
          email: req.body.email,
          password: req.body.password,
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newCustomer.password, salt, (err, hash) => {
            if (err) throw err;
            newCustomer.password = hash;
            newCustomer.save()
              .then(customer => {
                req.flash('success_msg', 'Account registration is successful, you can log in to start downloading the game now');
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          })
        })
      }
    })
  }

})

module.exports = router