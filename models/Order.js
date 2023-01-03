const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }]
}, { timestamps: true })

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order