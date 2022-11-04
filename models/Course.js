const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  instructors: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  collections: {
    type: Array,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  status: {
    type: String, 
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tableOfContents: [{
    type: String,
    require: true
  }],
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Course = mongoose.model('Course', CourseSchema)

module.exports = Course