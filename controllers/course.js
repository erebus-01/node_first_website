const Course = require("../models/Course");
const Categories = require("../models/Categories");
const Blog = require("../models/Blog");
const User = require("../models/User");

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
const getBlog = async (req, res, next) => {
  let id = req.params.id;
  try{
    const categories = await Categories.find({})
    Blog.findById(id, (error, blog) => {
      if(error) {
        res.redirect('/tables_blog')
      }
      else{
        if(blog == null) {
          res.redirect('/tables_blog')
        }
        else{
          res.render('./admin/pages/update/edit_blog', { layout: "admin/layout", blog: blog, categories: categories})
        }
      }
    })
  }
  catch(error) {
    res.status(500).json({msg: error});
  }
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

module.exports = {
  getAllCourses,
  getAllCategories,
  fetchAllBlog,
  getAllUser,
  getCategories,
  getBlog,
  getCourse,
  getAllBlog
};
