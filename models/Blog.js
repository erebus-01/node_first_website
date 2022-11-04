const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  imageBlog: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
  collections: [{
    type: String,
    require: true
  }],
  createDate: {
    type: Date,
    require: true,
    default: Date.now
  }
})

const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog