const express = require('express');
const router = express.Router();
const fs = require('fs');
const { ensureAuthenticated } = require('../config/auth')

const {
  getAllCourses,
  getAllCategories,
  getAllUser,
  fetchAllBlog,
  getCategories,
  getBlog,
  getAllBlog,
  getCourse,
} = require('../controllers/course')


const Course = require("../models/Course");
const User = require("../models/User");
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

router.get('/index', ensureAuthenticated, (req, res) => {
  res.render('./admin/index', {layout: 'admin/layout', name: req.user.dsName});
})

//Course routes
// router.route("/forms").post(createCourse);
router.route("/tables_course").get(getAllCourses)
router.route("/tables_blog").get(fetchAllBlog)
router.route("/tables_categories").get(getAllCategories)
router.route("/tables_user").get(getAllUser)
router.route("/blog").get(getAllBlog)
router.route("/edit_course/:id").get(getCourse)
router.route("/edit_blog/:id").get(getBlog);
router.route("/edit_categories/:id").get(getCategories);

// insert data
router.post('/forms', uploadCourse, (req, res) => {
  console.log(req.body);
  const arrTable = req.body.tableContent
  const tableOfContent = arrTable.split('\r\n')
  let err = [];

  const newCourse = new Course({
    instructors: req.body.instructors,
    title: req.body.title,
    overview: req.body.overview,
    collections: req.body.collections,
    course: req.file.filename,
    status: req.body.status,
    description: req.body.description,
    tableOfContents: tableOfContent
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
    req.flash('error_msg', 'Course saved failed');
    res.redirect('/admin/forms');
  }
  else{
    newCourse.save().then(course => {
      req.flash('success_msg', 'Course saved successfully');
      res.redirect('/admin/forms');
    })
    .catch(err => console.log(err))
  }
})
router.get('/forms', ensureAuthenticated, (req, res) => {
  res.render('./admin/pages/forms/forms', {layout: 'admin/layout'});
})

router.get('/categories', ensureAuthenticated, (req, res) => {
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
        req.flash('error_msg', 'Tags is existed');
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

router.post('/blog', uploadBlog, (req, res) => {
  console.log(req.body);
  const arrTable = req.body.tableContent
  const tableOfContent = arrTable.split('\r\n')
  let err = [];

  const newBlog = new Blog({
    title: req.body.title,
    imageBlog: req.file.filename,
    content: req.body.content,
    description: req.body.description,
    author: req.body.author,
    collections: req.body.collections,
    tableOfContent: tableOfContent
  });

  if(err.length > 0){
    req.flash('error_msg', 'Blog saved failed');
      res.redirect('/admin/blog');
  }
  else{
    newBlog.save().then(course => {
      req.flash('success_msg', 'Blog saved successfully');
      res.redirect('/admin/blog');
    })
    .catch(err => console.log(err))
  }
})

// update data
router.post('/update_blog/:id', uploadBlog, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if(req.file){
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/blog/' + req.body.old_image)
    }
    catch(err) {
      console.log(err)
    }
  }
  else {
    new_image = req.body.old_image
  }
  
  const arrTable = req.body.tableContent
  const tableOfContent = arrTable.split('\r\n')

  Blog.findByIdAndUpdate(id, {
    title: req.body.title,
    imageBlog: new_image,
    content: req.body.content,
    description: req.body.description,
    author: req.body.author,
    collections: req.body.collections,
    tableOfContent: tableOfContent
  }, (err, result) => {
    if(err) {
      req.flash('error_msg', 'Removed blog failed');
      res.redirect('/admin/tables_blog')
    }
    else{
      req.flash('success_msg', 'Updated blog successfully');
      res.redirect('/admin/tables_blog')
    }
  })

})
router.post('/update_course/:id', uploadCourse, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if(req.file){
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/course/' + req.body.old_image)
    }
    catch(err) {
      console.log(err)
    }
  }
  else {
    new_image = req.body.old_image
  }
  
  const arrTable = req.body.tableContent
  const tableOfContent = arrTable.split('\r\n')

  Course.findByIdAndUpdate(id, {
    instructors: req.body.instructors,
    title: req.body.title,
    overview: req.body.overview,
    collections: req.body.collections,
    course: new_image,
    status: req.body.status,
    description: req.body.description,
    tableOfContents: tableOfContent
  }, (err, result) => {
    if(err) {
      req.flash('error_msg', 'Updated course failed');
      res.redirect('/admin/tables_course')
    }
    else{
      req.flash('success_msg', 'Updated course successfully');
      res.redirect('/admin/tables_course')
    }
  })

})
router.post('/update_categories/:id', (req, res) => {
  let id = req.params.id;

  Categories.findByIdAndUpdate(id, {
    tags: req.body.tags,
    content: req.body.content,
  }, (err, result) => {
    if(err) {
      req.flash('error_msg', 'Updated categories failed');
      res.redirect('/admin/tables_categories')
    }
    else{
      req.flash('success_msg', 'Updated categories successfully');
      res.redirect('/admin/tables_categories')
    }
  })

})

// delete data
router.get('/delete_course/:id', (req, res) => {
  let id = req.params.id;
  Course.findByIdAndRemove(id, (err, result) => {
    if(result.course != "") {
      try {
        fs.unlinkSync("./uploads/course/" + result.course)
      }catch(err){
        console.log(err)
      }
    }

    if(err) {
      req.flash('error_msg', 'Removed course failed');
      res.redirect('/admin/tables_course')
    }
    else{
      req.flash('success_msg', 'Removed course successfully');
      res.redirect('/admin/tables_course')
    }
  })
})
router.get('/delete_blog/:id', (req, res) => {
  let id = req.params.id;
  Blog.findByIdAndRemove(id, (err, result) => {
    if(result.imageBlog != "") {
      try {
        fs.unlinkSync("./uploads/blog/" + result.imageBlog)
      }catch(err){
        console.log(err)
      }
    }

    if(err) {
      req.flash('error_msg', 'Removed blog failed');
      res.redirect('/admin/tables_blog')
    }
    else{
      req.flash('success_msg', 'Removed blog successfully');
      res.redirect('/admin/tables_blog')
    }
  })
})
router.get('/delete_categories/:id', (req, res) => {
  let id = req.params.id;
  Categories.findByIdAndRemove(id, (err, result) => {
    if(err) {
      req.flash('error_msg', 'Removed categories failed');
      res.redirect('/admin/tables_categories')
    }
    else{
      req.flash('success_msg', 'Removed categories successfully');
      res.redirect('/admin/tables_categories')
    }
  })
})
router.get('/delete_user/:id', (req, res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, result) => {
    if(err) {
      req.flash('error_msg', 'Removed user failed');
      res.redirect('/admin/tables_user')
    }
    else{
      req.flash('success_msg', 'Removed user successfully');
      res.redirect('/admin/tables_user')
    }
  })
})

// render form
router.get('/icons', ensureAuthenticated, (req, res) => {
  res.render('./admin/pages/icons/icon', {layout: 'admin/layout'});
})
router.get('/custom', ensureAuthenticated, (req, res) => {
  res.render('./admin/pages/ui-features/buttons', {layout: 'admin/layout'});
})
router.get('/charts', ensureAuthenticated, (req, res) => {
  res.render('./admin/pages/charts/chartjs', {layout: 'admin/layout'});
})

module.exports = router;