const Course = require("../models/Course");
const multer = require("multer");
const Categories = require("../models/Categories");
const Blog = require("../models/Blog");
const User = require("../models/User");

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

const getAllCourses = async (req, res, next) => {
  try{
    const courses = await Course.find({})
    res.render("./admin/pages/tables/tables_course", { layout: "admin/layout", courses: courses});
    next();
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
};

const getAllCategories = async (req, res, next) => {
  try{
    const categories = await Categories.find({})
    res.render("./admin/pages/tables/tables_categories", { layout: "admin/layout", categories: categories});
    next();
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
};

const getAllUser = async (req, res, next) => {
  try{
    const users = await User.find({})
    res.render("./admin/pages/tables/tables_user", { layout: "admin/layout", users: users});
    next();
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
}

const fetchAllBlog = async (req, res, next) => {
  try{
    const blogs = await Blog.find({})
    res.render("./admin/pages/tables/tables_blog", { layout: "admin/layout", blogs: blogs});
    next();
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
};


const getAllBlog = async (req, res, next) => {
  try{
    const categories = await Categories.find({})
    res.render("./admin/pages/blog/blog", { layout: "admin/layout", categories: categories});
    next();
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
};

const createCourse = (uploadCourse, (req, res) => {
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
});

const getCourse = (req, res) => {
  let id = req.params.id;
  Course.findById(id, (error, course) => {
    if(error) {
      res.redirect('/tables_course')
    }
    else{
      if(course == null) {
        res.redirect('/tables_course')
      }
      else{
        res.render('./admin/pages/update/edit_course', { layout: "admin/layout", course: course})
      }
    }
  })
};
const getBlog = (req, res) => {
  let id = req.params.id;
  Blog.findById(id, (error, blog) => {
    if(error) {
      res.redirect('/tables_blog')
    }
    else{
      if(blog == null) {
        res.redirect('/tables_blog')
      }
      else{
        res.render('./admin/pages/update/edit_blog', { layout: "admin/layout", blog: blog})
      }
    }
  })
};
const getCategories = (req, res) => {
  let id = req.params.id;
  Categories.findById(id, (error, categories) => {
    if(error) {
      res.status(500).json({msg: error});
    }
    else{
      if(categories == null) {
        res.status(500).json({msg: error});
      }
      else{
        res.render('./admin/pages/update/edit_categories', { layout: "admin/layout", categories: categories})
      }
    }
  })
};
const updateTask = (req, res) => {
  res.send("update course");
};
const deleteTask = (req, res) => {
  res.send("delete course");
};

module.exports = {
  getAllCourses,
  getAllCategories,
  fetchAllBlog,
  getAllUser,
  createCourse,
  getCategories,
  getBlog,
  getCourse,
  updateTask,
  deleteTask,
  getAllBlog
};
