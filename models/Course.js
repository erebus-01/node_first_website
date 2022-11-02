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
  tableOfContents: [
    new mongoose.Schema({
      nameTable: {
        type: String,
        required: false,
      },
      contentTable: {
        type: String,
        required: false,
      },
    })
  ],
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  }
})

const Course = mongoose.model('Course', CourseSchema)

module.exports = Course