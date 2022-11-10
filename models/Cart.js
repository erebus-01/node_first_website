const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
  customer:  { type: mongoose.Types.ObjectId, ref: 'Customer', required: true },
  cartItems: [
    {
      product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
      quantity: {type: Number, default: 1},
      price: {type: Number, required: true}
    }
  ]
}, { timestamps: true })

const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart