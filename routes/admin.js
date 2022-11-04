const express = require('express');
const router = express.Router();

const {
  getAllCourses,
  getAllCategories,
  getAllUser,
  fetchAllCategories,
  createCourse,
  getTask,
  updateTask,
  getAllBlog,
  deleteTask
} = require('../controllers/course')


const Course = require("../models/Course");
const Blog = require("../models/Blog");
const Categories = require("../models/Categories");

const multer = require("multer");

var storageProfile = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/blog");
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

var uploadBlog = multer({
  storage: storageProfile,
}).single("blog");

var uploadCourse = multer({
  storage: storageCourse,
}).single('course');

router.get('/index', (req, res) => {
  res.render('./admin/index', {layout: 'admin/layout'});
})

//Course routes
// router.route("/forms").post(createCourse);
router.route("/tables_course").get(getAllCourses)
router.route("/tables_blog").get(fetchAllCategories)
router.route("/tables_categories").get(getAllCategories)
router.route("/tables_user").get(getAllUser)
router.route("/blog").get(getAllBlog)
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

  if(!req.body.instructors || 
    !req.body.title || 
    !req.body.overview || 
    !req.body.collections || 
    !req.file.filename || 
    !req.body.status || 
    !req.body.description
  ){
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

// router.get('/blog', async (req, res) => {
//   try{
//     const categories = await Categories.find({})
//     res.render("./admin/pages/categories/categories", { layout: "admin/layout", categories: categories});
//     next();
//   }
//   catch(error) {
//     res.status(500).json({msg: error});
//   }
// })
router.post('/blog', uploadBlog, (req, res) => {
  console.log(req.body);
  let err = [];

  const newBlog = new Blog({
    title: req.body.title,
    imageBlog: req.file.filename,
    content: req.body.content,
    description: req.body.description,
    author: req.body.author,
    collections: req.body.collections,
  });

  // if(!req.body.instructors || 
  //   !req.body.title || 
  //   !req.body.overview || 
  //   !req.body.collections || 
  //   !req.file.filename || 
  //   !req.body.status || 
  //   !req.body.description
  // ){
  //   err.push({msg: "Please fill in all required fields \n"})
  // }

  if(err.length > 0){
    res.render('./admin/pages/blog/blog')
  }
  else{
    newBlog.save().then(course => {
      req.flash('success_msg', 'Blog saved successfully');
      res.redirect('/admin/blog');
    })
    .catch(err => console.log(err))
  }
})

router.get('/categories', (req, res) => {
  res.render('./admin/pages/categories/categories', {layout: 'admin/layout'});
})
router.post('/categories', (req, res) => {
  console.log(req.body);
  let err = [];

  const newCategories = new Categories({
    tags: req.body.tags,
    content: req.body.content,
  });

  if(!req.body.tags || !req.body.content ){
    err.push({msg: "Please fill in all required fields \n"})
  }

  if(err.length > 0){
    res.render('./admin/pages/categories/categories')
  }
  else{
    Categories.findOne({
      tags: req.body.tags
    }).then(categories => {
      if(categories){
        err.push({msg: "Tags name already registered"})
        console.log('Tags name already registered')
        res.redirect('/admin/categories');
      }
      else{
        newCategories.save().then(course => {
          req.flash('success_msg', 'Categories saved successfully');
          res.redirect('/admin/categories');
        })
        .catch(err => console.log(err))
      }
    })
  }
})

router.get('/icons', (req, res) => {
  res.render('./admin/pages/icons/icon', {layout: 'admin/layout'});
})

// router.get('/tables', (req, res) => {
//   res.render('./admin/pages/tables/table', {layout: 'admin/layout'});
// })

router.get('/custom', (req, res) => {
  res.render('./admin/pages/ui-features/buttons', {layout: 'admin/layout'});
})

module.exports = router;