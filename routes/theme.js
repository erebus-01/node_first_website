const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render("./theme/HTML/HomePage", {layout: 'theme/layout'})
})
router.get('/learn', (req, res) => {
  res.render("./theme/HTML/Learn", {layout: 'theme/layout'})
})
router.get('/measure', (req, res) => {
  res.render("./theme/HTML/Measure", {layout: 'theme/layout'})
})
router.get('/blog', (req, res) => {
  res.render("./theme/HTML/Blog", {layout: 'theme/layout'})
})
router.get('/tags/case-study', (req, res) => {
  res.render("./theme/HTML/CaseStudy", {layout: 'theme/layout'})
})
router.get('/about', (req, res) => {
  res.render("./theme/HTML/About", {layout: 'theme/layout'})
})
router.get('/learn/css', (req, res) => {
  res.render("./theme/HTML/DetailCourse")
})
router.get('/blog/css', (req, res) => {
  res.render("./theme/HTML/DetailBlog", {layout: 'theme/layout'})
})
router.get('/tags', (req, res) => {
  res.render("./theme/HTML/Tag", {layout: 'theme/layout'})
})
router.get('/login', (req, res) => {
  res.render("./theme/HTML/Login", {layout: 'theme/layout'})
})
router.get('/register', (req, res) => {
  res.render("./theme/HTML/Register", {layout: 'theme/layout'})
})

module.exports = router