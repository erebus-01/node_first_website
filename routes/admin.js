const express = require('express');
const router = express.Router();

const {
  getAllCourses,
  createCourse,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/course')

router.get('/index', (req, res) => {
  res.render('./admin/index', {layout: 'admin/layout'});
})

//Course routes
router.route("/forms").get(getAllCourses).post(createCourse);
router.route("/forms/:id").get(getTask).patch(updateTask).delete(deleteTask);

router.get('/charts', (req, res) => {
  res.render('./admin/pages/charts/chartjs', {layout: 'admin/layout'});
})

router.get('/forms', (req, res) => {
  res.render('./admin/pages/forms/forms', {layout: 'admin/layout'});
})

router.get('/icons', (req, res) => {
  res.render('./admin/pages/icons/icon', {layout: 'admin/layout'});
})

router.get('/tables', (req, res) => {
  res.render('./admin/pages/tables/table', {layout: 'admin/layout'});
})

router.get('/custom', (req, res) => {
  res.render('./admin/pages/ui-features/buttons', {layout: 'admin/layout'});
})

module.exports = router;