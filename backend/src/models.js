const mongoose = require('mongoose');

// Subscriber Schema
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String },
  image: { type: String },
  category: { type: String, enum: ['watches', 'wallets', 'handbags'], required: true },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { suppressReservedKeysWarning: true });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  items: [
    {
      id: String,
      title: String,
      brand: String,
      price: Number,
      quantity: Number,
    },
  ],
  customer: String,
  email: String,
  phone: String,
  address: String,
  paymentMethod: String,
  total: Number,
  status: { type: String, default: 'pending' },
  paymentId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  Subscriber: mongoose.model('Subscriber', subscriberSchema)
};
