const Course = require("../models/Course");
const multer = require("multer");

var storageProfile = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "../uploads/profile");
  },
  filename: (res, files, cb) => {
    cb(null, files.fieldname + "_" + Date.now() + "_" + files.originalname);
  },
});

var storageCourse = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "../uploads/course");
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
}).single("course");

const getAllCourses = (req, res, next) => {
  res.render("./admin/pages/forms/forms", { layout: "admin/layout" });
};

const createCourse = (req, res) => {
  console.log(req.body);
  const {
    instructors,
    profile,
    title,
    overview,
    collections,
    course,
    status,
    description,
  } = req.body;
  let err = [];

  const newCourse = new Course({
    instructors,
    profile,
    title,
    overview,
    collections,
    course,
    status,
    description,
  });

  if(!instructors || ! profile || ! title || ! overview || ! collections || ! course || ! status || ! description){
    err.push({msg: "Please fill in all required fields \n"})
  }

  if(err.length > 0){
    res.render('/admin/forms', {
      instructors,
      profile,
      title,
      overview,
      collections,
      course,
      status,
      description,
    })
  }
  else{
    newCourse.save().then(course => {
      req.flash('success_msg', 'Course saved successfully');
      req.redirect('admin/forms');
    })
    .catch(err => console.log(err))
  }
};

const getTask = (req, res) => {
  res.send("get course");
};
const updateTask = (req, res) => {
  res.send("update course");
};
const deleteTask = (req, res) => {
  res.send("delete course");
};

module.exports = {
  getAllCourses,
  createCourse,
  getTask,
  updateTask,
  deleteTask,
};
