const express = require('express')
const Blog = require('../models/Blog')
const Categories = require('../models/Categories')
const router = express.Router()

const Course = require("../models/Course")

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
router.get('/measure', (req, res) => {
  res.render("./theme/HTML/Measure", {layout: 'theme/layout'})
})
router.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find({})
    res.render("./theme/HTML/Blog", {layout: 'theme/layout', blogs: blogs})
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/tags/case-study', (req, res) => {
  res.render("./theme/HTML/CaseStudy", {layout: 'theme/layout'})
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
router.get('/tags/:page/', async (req, res) => {
  const currentPage = req.params.page || 0
  const nextPage = 18
  try {
    const tags = await Categories.find({}).skip(currentPage * nextPage).limit(nextPage)
    res.render("./theme/HTML/Tag", {layout: 'theme/layout', tags: tags})
    next()
  }catch (err){
    console.log(err)
  }
})
router.get('/login', (req, res) => {
  res.render("./theme/HTML/Login", {layout: 'theme/layout'})
})
router.get('/register', (req, res) => {
  res.render("./theme/HTML/Register", {layout: 'theme/layout'})
})

module.exports = router