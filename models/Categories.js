const mongoose = require('mongoose');
const CategoriesSchema = new mongoose.Schema({
  tags: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createDate:{
    type: Date,
    required: true,
    default: Date.now
  }
})

const Categories = mongoose.model('Categories', CategoriesSchema)

module.exports = Categories