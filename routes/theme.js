const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')
const passport = require('passport')
const stripe = require('stripe')('sk_test_51JXp4MKDUxtyKwlOqQQg6AkI66JciVOYYGpbs9f7oSiGn9owWM2ijXHsFVSfQxorViLvTUmz8g4qfjXNyw476eqn00NgFxis6U');

const Blog = require('../models/Blog')
const Categories = require('../models/Categories')
const Course = require("../models/Course")
const Customer = require('../models/Customer')
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const { ensureAuthenticated } = require('../config/Authenticated')

router.get('/', async (req, res, next) => {
  try {
    const courseSlide = await Course.find({collections: 'Challenger'})
    // console.log(courseSlide)
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

    // console.log(courseSlide)
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
    // console.log(blogs)
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

router.post('/add-to-cart', ensureAuthenticated, (req, res, next) => {
  const { product, price } = req.body 
  console.log({ product, price }, req.user._id)

  Cart.find({"customer": req.user._id})
  .exec((error, cart) => {
    if(error) return res.status(500).json({msg: error})
    if(cart){
      let isExists = false
      cart.forEach(item => {
        item.cartItems.forEach(elem => {
          if(elem.product == product) {
            isExists = true
          }
          console.log(elem.product)
        })
      })

      if (isExists) {
        req.flash('error_msg', 'Course is existed in cart !!!');
        res.redirect('/learn');
      }
      else {
        Cart.findOneAndUpdate({"customer": req.user._id}, {
          "$push": {
            "cartItems": { product, price }
          }
        })
        .exec((error, _cart) => {
          if(error) return res.status(500).json({msg: error})
          if(_cart) {
            req.flash('success_msg', 'Successfully added the course to your cart !!!');
            res.redirect('/learn');
          }
        })
      }
    }
    else {
      const newCart = new Cart({
        customer: req.user._id,
        cartItems: [product, price ]
      });
    
      newCart.save().then(cart => {
        req.flash('success_msg', 'Successfully added the course to your cart !!!');
        res.redirect('/learn');
      })
      .catch(error => console.log(error));
    }
  })


})

router.get('/cart_delete/:id', ensureAuthenticated, (req, res) => {
  let id = req.params.id;
  Cart.find({"customer": req.user._id})
  .exec((error, cart) => {
    if(error) return res.status(500).json({msg: error})
    if(cart){
      let isExists = false
      cart.forEach(item => {
        item.cartItems.forEach(elem => {
          if(elem.product == id) {
            isExists = true
          }
        })
      })
      
      if (isExists) {
        Cart.findOneAndUpdate({"customer": req.user._id}, {
          "$pull": {
            "cartItems": {
              product: mongoose.Types.ObjectId(id)
            }
          }
        })
        .exec((error, _cart) => {
          if(error) return res.status(500).json({msg: error})
          if(_cart) {
            req.flash('success_msg', 'Successfully added the course to your cart !!!');
            res.redirect('/cart');
          }
        })
        console.log("xoa thanh cong");
      }
      else {
        req.flash('error_msg', 'Course is existed in cart !!!');
        console.log("xoa that bai");
        res.redirect('/cart');
      }
    }
    else {
      console.log("loi roi");
    }
  })
})

router.get('/measure', (req, res) => {
  res.render("./theme/HTML/Measure", {layout: 'theme/layout'})
})

router.get('/login', (req, res) => {
  res.render("./theme/HTML/Login", {layout: 'theme/layout'})
})
router.post('/login' , (req, res, next) => {
  passport.authenticate('customer', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
})

//logout handle
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/register', (req, res) => {
  res.render("./theme/HTML/Register", {layout: 'theme/layout'})
})


router.get('/cart', ensureAuthenticated, async (req, res, next) => {
  try {
    const courseInCart = await Cart.find({customer: req.user._id})
    const countCourseInCart = await Cart.find({customer: req.user._id}).count()
    const getCourse = await Course.find({})

    let filterCourse = {}
    let arrTitle = []

    for(let elem of courseInCart){
      for(let i = 0; i < elem.cartItems.length; i++ ){
        filterCourse = await Course.find({_id: elem.cartItems[i].product})
        filterCourse.forEach(elem => {
          arrTitle.push(elem)
        })
      }
    }
    const total = 0;
    // console.log(arrTitle)

    const context = {
      layout: 'theme/layout', 
      courseInCart: courseInCart, 
      countCourseInCart: countCourseInCart, 
      getCourse: getCourse,
      total: total,
      user: req.user,
      arrTitle: arrTitle,
      filterCourse: filterCourse
    }

    // console.log(courseSlide)
    res.render("./theme/HTML/Cart", context)
    next()
  }catch (err){
    console.log(err)
  }
})

router.post('/checkout_cart', async (req, res) => {
  
  const courses = req.body.courses
  const lengthCourse = req.body.length
  const splitCourse = courses.split(",");
  console.log(splitCourse)
  const newOrder = new Order({
    email: req.body.customer,
    price: req.body.total,
    courses: splitCourse
  })
  const intLength = parseInt(lengthCourse)
  if(intLength > 0) {
    newOrder.save().then(course => {
      req.flash('success_msg', 'Your order has been');
      res.redirect('/learn')
    })
  
    // let id = req.params.id;
    Cart.find({"customer": req.user._id})
    .exec((error, cart) => {
      if(error) return res.status(500).json({msg: error})
      if(cart){
        // let isExists = false
        // cart.forEach(item => {
        //   item.cartItems.forEach(elem => {
        //     if(elem.product == id) {
        //       isExists = true
        //     }
        //   })
        // })
        
        // if (isExists) {
          splitCourse.forEach(idCourse => {
            Cart.findOneAndUpdate({"customer": req.user._id}, {
              "$pull": {
                "cartItems": {
                  product: mongoose.Types.ObjectId(idCourse)
                }
              }
            })
            .exec((error, _cart) => {
              if(error) return res.status(500).json({msg: error})
              if(_cart) {
                req.flash('success_msg', 'Successfully added the course to your cart !!!');
                // res.redirect('/learn');
              }
            })
          })
        // }
        // else {
        //   req.flash('error_msg', 'Course is existed in cart !!!');
        //   console.log("xoa that bai");
        //   res.redirect('/cart');
        // }
      }
      else {
        console.log("loi roi");
      }
    })
  }
  else {
    req.flash('error_msg', 'Your cart is empty !!! Please add some courses to your cart');
    res.redirect('/learn');
  }

})

router.get('/stripe', (req, res) => {
  res.render("./theme/HTML/stripe", {layout: 'theme/layout'})
})

router.post('/create-checkout', async (req, res) => {
  console.log(req.body.total)
  const totalPrice = Number(req.body.total)
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1MDjAaKDUxtyKwlOMDjaNIYP',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:5000/learn`,
    cancel_url: `http://localhost:5000/`,
  });

  res.redirect('/');
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