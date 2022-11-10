const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
  customer:  { type: mongoose.Types.ObjectId, ref: 'Customer', required: true },
  cartItems: [
    {
      product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
      price: {type: mongoose.Types.Decimal128, required: true}
    }
  ]
}, { timestamps: true })

const Cart = mongoose.model('Cart', CartSchema)

module.exports = Cart