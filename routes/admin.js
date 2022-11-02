const express = require('express');
const router = express.Router();

const {
  getAllCourses,
  createCourse,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/course')


const Course = require("../models/Course");
const multer = require("multer");

var storageProfile = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/profile");
  },
  filename: (res, files, cb) => {
    cb(null, files.fieldname + "_" + Date.now() + "_" + files.originalname);
  },
});

var storageCourse = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/course");
  },
  filename: (res, files, cb) => {
    cb(null, files.fieldname + "_" + Date.now() + "_" + files.originalname);
  },
});

var uploadProfile = multer({
  storage: storageProfile,
}).single("profile");

var uploadCourse = multer({
  storage: storageCourse,
}).single('course');

router.get('/index', (req, res) => {
  res.render('./admin/index', {layout: 'admin/layout'});
})

//Course routes
// router.route("/forms").post(createCourse);
router.route("/tables").get(getAllCourses)
router.route("/forms/:id").get(getTask).patch(updateTask).delete(deleteTask);

router.get('/charts', (req, res) => {
  res.render('./admin/pages/charts/chartjs', {layout: 'admin/layout'});
})

router.post('/forms', uploadCourse, (req, res) => {
  console.log(req.body);
  let err = [];

  const newCourse = new Course({
    instructors: req.body.instructors,
    title: req.body.title,
    overview: req.body.overview,
    collections: req.body.collections,
    course: req.file.filename,
    status: req.body.status,
    description: req.body.description,
  });

  if(!instructors || ! profile || ! title || ! overview || ! collections || ! course || ! status || ! description){
    err.push({msg: "Please fill in all required fields \n"})
  }

  if(err.length > 0){
    res.render('./admin/pages/forms/forms')
  }
  else{
    newCourse.save().then(course => {
      req.flash('success_msg', 'Course saved successfully');
      res.redirect('/admin/forms');
    })
    .catch(err => console.log(err))
  }
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